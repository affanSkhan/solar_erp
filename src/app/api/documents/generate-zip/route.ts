import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import JSZip from 'jszip';
import path from 'path';
import { generateProjectDocumentsInMemory, TEMPLATE_FILES } from '@/lib/documentGenerator';
import { validatePayload, buildDocumentContext, parseDateInput, DEFAULTS } from '@/lib/routeHelpers';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as Record<string, unknown>;

    const missing = validatePayload(data);
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const docContext = buildDocumentContext(data);

    // 1. Upsert Customer
    const customer = await prisma.customer.upsert({
      where: { consumerNumber: docContext.consumer_number || 'UNKNOWN' },
      update: {
        name: docContext.customer_name || 'UNKNOWN',
        address: docContext.customer_address || 'UNKNOWN',
        mobile: docContext.mobile_number || 'UNKNOWN',
        email: docContext.email || null,
        aadhaarNumber: docContext.aadhaar_number || null,
      },
      create: {
        name: docContext.customer_name || 'UNKNOWN',
        consumerNumber: docContext.consumer_number || 'UNKNOWN',
        address: docContext.customer_address || 'UNKNOWN',
        mobile: docContext.mobile_number || 'UNKNOWN',
        email: docContext.email || null,
        aadhaarNumber: docContext.aadhaar_number || null,
      },
    });

    // 2. Find or create admin user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: 'admin@solarerp.com', password: 'admin', name: 'System Admin', role: 'ADMIN' },
      });
    }

    // 3. Create Project
    const project = await prisma.project.create({
      data: {
        customerId: customer.id,
        userId: user.id,
        projectCapacity: Number(docContext.project_capacity) || 0,
        sanctionedCapacity: Number(docContext.sanctioned_capacity) || 0,
        installationDate: parseDateInput(data.installation_date),
        applicationNumber: docContext.application_number || null,
        applicationDate: parseDateInput(data.application_date),
        vendorName: docContext.vendor_name || DEFAULTS.vendorName,
        vendorAddress: docContext.vendor_address || DEFAULTS.vendorAddress,
        vendorPhone: docContext.vendor_phone || DEFAULTS.vendorPhone,
        vendorEmail: docContext.vendor_email || DEFAULTS.vendorEmail,
        vendorGstin: docContext.vendor_gstin || DEFAULTS.vendorGstin,
        moduleMake: docContext.module_make || '',
        moduleModel: docContext.module_model || '',
        moduleWattage: Number(docContext.module_wattage) || 0,
        moduleQuantity: Number(docContext.module_quantity) || 0,
        moduleTotalCapacity: Number(docContext.module_total_capacity) || 0,
        inverterMake: docContext.inverter_make || '',
        inverterModel: docContext.inverter_model || '',
        inverterCapacity: Number(docContext.inverter_capacity) || 0,
      },
    });

    // 4. Generate all docs in memory (no filesystem writes — works on Vercel)
    const templatesDir = path.resolve(process.cwd(), 'templates');
    const { docs, failedTemplates } = await generateProjectDocumentsInMemory(docContext, templatesDir);

    if (docs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No documents generated', failedTemplates },
        { status: 500 }
      );
    }

    // 5. Bundle all docs into a single ZIP
    const jszip = new JSZip();
    for (const doc of docs) {
      jszip.file(doc.name, doc.buffer);
    }
    const zipBuffer = await jszip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    // 6. Save document records to DB
    for (const doc of docs) {
      const type = doc.name
        .replace(`_${docContext.customer_name.replace(/\s+/g, '_')}.docx`, '')
        .replace('.docx', '');
      await prisma.document.create({
        data: { projectId: project.id, type, pathDocx: doc.name, pathPdf: null },
      });
    }

    // 7. Update status + audit log
    await prisma.project.update({ where: { id: project.id }, data: { status: 'DOCUMENTS_GENERATED' } });
    await prisma.auditLog.create({
      data: {
        projectId: project.id,
        action: `Generated ${docs.length}/${TEMPLATE_FILES.length} document(s) as ZIP`,
        performedBy: user.id,
      },
    });

    // 8. Return as ZIP download
    const zipName = `${docContext.consumer_number}_${docContext.customer_name.replace(/\s+/g, '_')}_docs.zip`;
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipName}"`,
        'X-Project-Id': project.id,
        'X-Failed-Count': String(failedTemplates.length),
      },
    });

  } catch (error: any) {
    console.error('ZIP generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
