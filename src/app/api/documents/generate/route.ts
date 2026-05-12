import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  generateProjectDocuments,
  DocumentContext,
  TEMPLATE_FILES
} from '@/lib/documentGenerator';
import path from 'path';

const prisma = new PrismaClient();

const DEFAULTS = {
  vendorName: 'PARADISE ENERGIES',
  vendorAddress: 'IN FRONT OF TAHESIL OFFICE, BARSHITAKLI Dist - AKOLA, Pin Code 444401',
  vendorPhone: '7767037077',
  vendorEmail: 'paradiseenergies@gmail.com',
  vendorGstin: '27CLEPS3644D2Z1',
  vendorOwner: 'Authorized Signatory',
  discomName: 'MSEDCL',
  licenseeName: 'MSEDCL, AKOLA U-III S/DN AKOLA',
  location: 'AKOLA U-I S/DN',
  reArrangementType: 'Net Metering Arrangement',
  reSource: 'Solar',
  projectModel: 'Capex',
  inverterPhase: '1ph',
  gridVoltage: '230-240',
  inverterIpRating: 'IP65',
  maintenanceYears: '5 years',
  performanceRatio: '75%',
  registrationFees: '590'
} as const;

function text(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : fallback;
}

function numberText(value: unknown, fallback = '0'): string {
  const raw = text(value, fallback).replace(/,/g, '').trim();
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return String(n);
}

function integerText(value: unknown, fallback = '0'): string {
  const raw = text(value, fallback).replace(/,/g, '').trim();
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return String(Math.trunc(n));
}

function withUnit(value: unknown, unit: string, fallback = ''): string {
  const n = numberText(value, '');
  if (!n) return fallback;
  return `${n} ${unit}`;
}

function parseDateInput(value: unknown): Date | null {
  const v = text(value);
  if (!v) return null;

  // HTML input type=date format
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const parsed = new Date(`${v}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // DD/MM/YYYY format
  const dm = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (dm) {
    const parsed = new Date(`${dm[3]}-${dm[2]}-${dm[1]}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const generic = new Date(v);
  return Number.isNaN(generic.getTime()) ? null : generic;
}

function formatDateForDocs(value: unknown): string {
  const parsed = parseDateInput(value);
  if (!parsed) return '';
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = String(parsed.getFullYear());
  return `${day}/${month}/${year}`;
}

function yearFromDate(value: unknown): string {
  const parsed = parseDateInput(value);
  if (!parsed) return '';
  return String(parsed.getFullYear());
}

function validatePayload(data: Record<string, unknown>): string[] {
  const requiredFields = [
    'customer_name',
    'consumer_number',
    'customer_address',
    'mobile_number',
    'project_capacity',
    'sanctioned_capacity',
    'installation_date',
    'module_make',
    'module_wattage',
    'module_quantity',
    'module_total_capacity',
    'inverter_make',
    'inverter_capacity',
    'module_efficiency',
    'agreement_cost',
    'earthing_count',
    'earth_resistance',
    'power_output_before',
    'power_output_after',
    'grid_side_voltage',
    'inverter_side_voltage'
  ];

  const missing: string[] = [];
  for (const field of requiredFields) {
    if (!text(data[field])) missing.push(field);
  }
  return missing;
}

function buildDocumentContext(data: Record<string, unknown>): DocumentContext {
  const installationDate = formatDateForDocs(data.installation_date);
  const applicationDate = formatDateForDocs(data.application_date || data.installation_date);
  const observationDate = formatDateForDocs(data.observation_date || data.installation_date);
  const projectCapacity = numberText(data.project_capacity);
  const sanctionedCapacity = numberText(data.sanctioned_capacity);
  const moduleWattage = numberText(data.module_wattage);
  const moduleTotalCapacity = numberText(data.module_total_capacity);
  const inverterCapacity = numberText(data.inverter_capacity);
  const gridVoltage = text(data.grid_voltage, DEFAULTS.gridVoltage);

  return {
    // Customer
    customer_name: text(data.customer_name),
    consumer_number: text(data.consumer_number),
    customer_address: text(data.customer_address),
    mobile_number: text(data.mobile_number),
    email: text(data.email),
    aadhaar_number: text(data.aadhaar_number),

    // Project
    project_capacity: projectCapacity,
    sanctioned_capacity: sanctionedCapacity,
    project_capacity_display: `${projectCapacity} KW`,
    sanctioned_capacity_display: `${sanctionedCapacity} KW`,
    installation_date: installationDate,
    application_number: text(data.application_number),
    application_date: applicationDate,
    project_model: text(data.project_model, DEFAULTS.projectModel),
    re_arrangement_type: text(data.re_arrangement_type, DEFAULTS.reArrangementType),
    re_source: text(data.re_source, DEFAULTS.reSource),

    // Vendor
    vendor_name: text(data.vendor_name, DEFAULTS.vendorName),
    vendor_address: text(data.vendor_address, DEFAULTS.vendorAddress),
    vendor_phone: text(data.vendor_phone, DEFAULTS.vendorPhone),
    vendor_email: text(data.vendor_email, DEFAULTS.vendorEmail),
    vendor_gstin: text(data.vendor_gstin, DEFAULTS.vendorGstin),
    vendor_owner: text(data.vendor_owner, DEFAULTS.vendorOwner),

    // Solar panel
    module_make: text(data.module_make),
    module_model: text(data.module_model),
    module_wattage: moduleWattage,
    module_wattage_display: `${moduleWattage} WP`,
    module_quantity: integerText(data.module_quantity),
    module_total_capacity: moduleTotalCapacity,
    module_total_capacity_display: `${moduleTotalCapacity} KW`,
    module_efficiency: text(data.module_efficiency, '0'),
    module_efficiency_display: `${text(data.module_efficiency, '0')}%`,
    module_serial_numbers: text(data.module_serial_numbers),

    // Inverter
    inverter_make: text(data.inverter_make),
    inverter_model: text(data.inverter_model),
    inverter_capacity: inverterCapacity,
    inverter_capacity_display: `${inverterCapacity} KW`,
    inverter_phase: text(data.inverter_phase, DEFAULTS.inverterPhase),
    grid_voltage: gridVoltage,
    grid_voltage_display: /v$/i.test(gridVoltage) ? gridVoltage : `${gridVoltage} V`,
    inverter_ip_rating: text(data.inverter_ip_rating, DEFAULTS.inverterIpRating),
    manufacturing_year: text(data.manufacturing_year, yearFromDate(data.installation_date)),

    // Technical
    earthing_count: text(data.earthing_count, '0'),
    earth_resistance: text(data.earth_resistance, '0 Ohm'),
    power_output_before: text(data.power_output_before, '0 Watts'),
    power_output_after: text(data.power_output_after, '0 Watts'),
    grid_side_voltage: text(data.grid_side_voltage, '0 V'),
    inverter_side_voltage: text(data.inverter_side_voltage, '0 V'),
    earthing_display: `${text(data.earthing_count, '0')} Nos, ${text(data.earth_resistance, '0 Ohm')}`,
    power_output_before_display: withUnit(data.power_output_before, 'Watts', '0 Watts'),
    power_output_after_display: withUnit(data.power_output_after, 'Watts', '0 Watts'),
    grid_side_voltage_display: withUnit(data.grid_side_voltage, 'V', '0 V'),
    inverter_side_voltage_display: withUnit(data.inverter_side_voltage, 'V', '0 V'),

    // Agreement / legal
    agreement_date: formatDateForDocs(data.agreement_date || data.installation_date),
    agreement_cost: text(data.agreement_cost, '0'),
    agreement_cost_display: `Rs. ${numberText(data.agreement_cost, '0')}`,
    maintenance_years: text(data.maintenance_years, DEFAULTS.maintenanceYears),
    performance_ratio: text(data.performance_ratio, DEFAULTS.performanceRatio),

    // Utility fields
    discom_name: text(data.discom_name, DEFAULTS.discomName),
    location: text(data.location, DEFAULTS.location),
    licensee_name: text(data.licensee_name, DEFAULTS.licenseeName),
    registration_fees: text(data.registration_fees, DEFAULTS.registrationFees),
    observation_date: observationDate
  };
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as Record<string, unknown>;
    const missing = validatePayload(data);
    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missing.join(', ')}`
        },
        { status: 400 }
      );
    }

    const docContext = buildDocumentContext(data);

    // 1. Create or Find Customer
    const customer = await prisma.customer.upsert({
      where: { consumerNumber: docContext.consumer_number || 'UNKNOWN_CONSUMER' },
      update: {
        name: docContext.customer_name || 'UNKNOWN',
        address: docContext.customer_address || 'UNKNOWN',
        mobile: docContext.mobile_number || 'UNKNOWN',
        email: docContext.email || null,
        aadhaarNumber: docContext.aadhaar_number || null,
      },
      create: {
        name: docContext.customer_name || 'UNKNOWN',
        consumerNumber: docContext.consumer_number || 'UNKNOWN_CONSUMER',
        address: docContext.customer_address || 'UNKNOWN',
        mobile: docContext.mobile_number || 'UNKNOWN',
        email: docContext.email || null,
        aadhaarNumber: docContext.aadhaar_number || null,
      },
    });

    // 2. Mock User ID for now (Normally from NextAuth session)
    // To make this work without auth immediately, we assume an ADMIN user exists or create a dummy one
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@solarerp.com',
          password: 'hashed_password_here',
          name: 'System Admin',
          role: 'ADMIN',
        }
      });
    }

    // 3. Create Project record
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
      }
    });

    // 4. Generate Documents using our logic
    const templatesDir = path.resolve(process.cwd(), 'templates');
    const outputDir = path.resolve(process.cwd(), 'generated');
    const { generatedFiles, failedTemplates } = await generateProjectDocuments(
      docContext,
      templatesDir,
      outputDir
    );

    if (generatedFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No documents were generated',
          failedTemplates
        },
        { status: 500 }
      );
    }

    // 5. Save document records to DB
    for (const file of generatedFiles) {
      const fileName = path.basename(file);
      const type = fileName
        .replace(`_${docContext.customer_name.replace(/\s+/g, '_')}.docx`, '')
        .replace('.docx', '');

      await prisma.document.create({
        data: {
          projectId: project.id,
          type,
          pathDocx: file,
          pathPdf: null
        }
      });
    }

    // Update Project Status
    await prisma.project.update({
      where: { id: project.id },
      data: { status: 'DOCUMENTS_GENERATED' }
    });

    await prisma.auditLog.create({
      data: {
        projectId: project.id,
        action: `Generated ${generatedFiles.length}/${TEMPLATE_FILES.length} document(s)`,
        performedBy: user.id
      }
    });

    return NextResponse.json({ 
      success: true, 
      projectId: project.id,
      generatedFiles,
      failedTemplates
    });

  } catch (error: any) {
    console.error('Error in Document Generation API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
