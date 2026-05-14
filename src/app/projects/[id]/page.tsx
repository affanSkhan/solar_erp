import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrismaClient, ProjectStatus } from '@prisma/client';
import { AdvanceStatusButton } from './AdvanceStatusButton';


const prisma = new PrismaClient();

const STATUS_FLOW: ProjectStatus[] = [
  'CREATED',
  'DOCUMENTS_GENERATED',
  'SUBMITTED',
  'VERIFICATION_PENDING',
  'METER_INSTALLATION_PENDING',
  'APPROVED',
  'COMPLETED',
];

const STATUS_LABELS: Record<ProjectStatus, string> = {
  CREATED: 'Created',
  DOCUMENTS_GENERATED: 'Docs Generated',
  SUBMITTED: 'Submitted',
  VERIFICATION_PENDING: 'Verification Pending',
  METER_INSTALLATION_PENDING: 'Meter Installation Pending',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
};

const DOC_LABELS: Record<string, string> = {
  ANNEXURE_I: 'Annexure I',
  MODEL_AG: 'Model Agreement',
  Net_Metering_Agreement: 'Net Metering Agreement',
  DCR_DECLARATION: 'DCR Declaration',
  Islanding_Certificate: 'Islanding Certificate',
  WCR_ISLANDING: 'WCR & Islanding Report',
};

function getDocLabel(type: string): string {
  for (const [key, label] of Object.entries(DOC_LABELS)) {
    if (type.includes(key)) return label;
  }
  return type;
}

function StatusTimeline({ currentStatus }: { currentStatus: ProjectStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-2">
      {STATUS_FLOW.map((status, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={status} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  done
                    ? 'bg-green-500 border-green-500 text-white'
                    : active
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={`mt-1 text-xs text-center max-w-[80px] leading-tight ${
                  active ? 'text-blue-700 font-semibold' : done ? 'text-green-700' : 'text-gray-400'
                }`}
              >
                {STATUS_LABELS[status]}
              </span>
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <div
                className={`h-0.5 w-8 mx-1 mt-[-18px] ${
                  done ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let project: any = null;

  try {
    project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        documents: { orderBy: { generatedAt: 'asc' } },
        logs: { orderBy: { createdAt: 'desc' }, take: 10 },
        user: true,
      },
    });
  } catch (e) {
    // DB error – fall through to notFound
  }

  if (!project) return notFound();

  const { customer, documents, logs, user } = project;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline mb-2 block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-500 mt-1">Consumer No: <span className="font-mono">{customer.consumerNumber}</span></p>
        </div>
        <div className="flex flex-col items-end gap-3 mt-2">
          <span
            className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
              project.status === 'COMPLETED'
                ? 'bg-green-100 text-green-800'
                : project.status === 'DOCUMENTS_GENERATED'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {STATUS_LABELS[project.status as ProjectStatus]}
          </span>
          <AdvanceStatusButton projectId={project.id} currentStatus={project.status} />
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Project Progress</h2>
        <StatusTimeline currentStatus={project.status as ProjectStatus} />
      </div>

      {/* Two-column: Customer + Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{customer.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Consumer No.</dt>
              <dd className="font-mono text-gray-900">{customer.consumerNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Mobile</dt>
              <dd className="text-gray-900">{customer.mobile}</dd>
            </div>
            {customer.email && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-900">{customer.email}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Address</dt>
              <dd className="text-gray-900 text-right max-w-[200px]">{customer.address}</dd>
            </div>
            {customer.aadhaarNumber && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Aadhaar</dt>
                <dd className="font-mono text-gray-900">{customer.aadhaarNumber}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Project / Solar Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Project Capacity</dt>
              <dd className="font-medium text-gray-900">{project.projectCapacity} KW</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Sanctioned Capacity</dt>
              <dd className="text-gray-900">{project.sanctionedCapacity} KW</dd>
            </div>
            {project.installationDate && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Installation Date</dt>
                <dd className="text-gray-900">
                  {new Date(project.installationDate).toLocaleDateString('en-IN')}
                </dd>
              </div>
            )}
            {project.applicationNumber && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Application No.</dt>
                <dd className="font-mono text-gray-900">{project.applicationNumber}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Module</dt>
              <dd className="text-gray-900">{project.moduleMake} — {project.moduleWattage}Wp × {project.moduleQuantity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Inverter</dt>
              <dd className="text-gray-900">{project.inverterMake} {project.inverterCapacity} KW</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Vendor</dt>
              <dd className="text-gray-900">{project.vendorName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created by</dt>
              <dd className="text-gray-900">{user?.name ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created on</dt>
              <dd className="text-gray-900">
                {new Date(project.createdAt).toLocaleDateString('en-IN')}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Generated Documents */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Generated Documents
            <span className="ml-2 text-sm font-normal text-gray-500">({documents.length} files)</span>
          </h2>
        </div>
        {documents.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-500">
            No documents generated yet.{' '}
            <Link href="/projects/new" className="text-blue-600 hover:underline">
              Generate a new project
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {documents.map((doc: any) => (
              <li key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{getDocLabel(doc.type)}</p>
                    <p className="text-xs text-gray-500">
                      Generated {new Date(doc.generatedAt).toLocaleString('en-IN')} · DOCX
                    </p>
                  </div>
                </div>
                <a
                  href={`/api/documents/download?path=${encodeURIComponent(doc.pathDocx)}`}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                  download
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Audit Log */}
      {logs.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Audit Log</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {logs.map((log: any) => (
              <li key={log.id} className="px-6 py-3 flex items-center justify-between text-sm">
                <span className="text-gray-800">{log.action}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(log.createdAt).toLocaleString('en-IN')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
