import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

const VALID_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  CREATED: ['DOCUMENTS_GENERATED'],
  DOCUMENTS_GENERATED: ['SUBMITTED'],
  SUBMITTED: ['VERIFICATION_PENDING'],
  VERIFICATION_PENDING: ['METER_INSTALLATION_PENDING'],
  METER_INSTALLATION_PENDING: ['APPROVED'],
  APPROVED: ['COMPLETED'],
  COMPLETED: [],
};

export async function POST(req: NextRequest) {
  try {
    const { projectId, newStatus } = await req.json();

    if (!projectId || !newStatus) {
      return NextResponse.json({ success: false, error: 'Missing projectId or newStatus' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const allowedNext = VALID_TRANSITIONS[project.status];
    if (!allowedNext.includes(newStatus as ProjectStatus)) {
      return NextResponse.json(
        { success: false, error: `Cannot transition from ${project.status} to ${newStatus}` },
        { status: 400 }
      );
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus as ProjectStatus },
    });

    // Log it
    const user = await prisma.user.findFirst();
    if (user) {
      await prisma.auditLog.create({
        data: {
          projectId,
          action: `Status changed from ${project.status} to ${newStatus}`,
          performedBy: user.id,
        },
      });
    }

    return NextResponse.json({ success: true, status: updated.status });
  } catch (error: any) {
    console.error('Status update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
