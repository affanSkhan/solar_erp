import Link from 'next/link';
import { Prisma, PrismaClient, ProjectStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  let totalProjects = 0;
  let pendingApprovals = 0;
  let generatedDocs = 0;
  let recentProjects: Prisma.ProjectGetPayload<{
    include: { customer: true; documents: true };
  }>[] = [];
  let dbUnavailable = false;

  try {
    if (userId) {
      totalProjects = await prisma.project.count({ where: { userId } });
      pendingApprovals = await prisma.project.count({
        where: {
          userId,
          status: {
            notIn: [
              ProjectStatus.COMPLETED,
              ProjectStatus.DOCUMENTS_GENERATED,
              ProjectStatus.CREATED,
            ],
          },
        },
      });
      generatedDocs = await prisma.document.count({
        where: { project: { userId } },
      });

      recentProjects = await prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          customer: true,
          documents: true,
        },
      });
    }
  } catch (error) {
    dbUnavailable = true;
    console.error('Failed to load dashboard data from database:', error);
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-8">Dashboard Overview</h1>

      {dbUnavailable && (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Database is unavailable. Start PostgreSQL on{' '}
          <strong>localhost:5433</strong> to load live dashboard data.
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <h3 className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Total Projects</h3>
          <p className="text-4xl font-extrabold text-slate-800 mt-3">{totalProjects}</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl group-hover:bg-emerald-200/50 transition-colors duration-500"></div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          <h3 className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Pending Approvals</h3>
          <p className="text-4xl font-extrabold text-amber-600 mt-3">{pendingApprovals}</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-100/50 rounded-full blur-2xl group-hover:bg-amber-200/50 transition-colors duration-500"></div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          <h3 className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Documents Generated</h3>
          <p className="text-4xl font-extrabold text-blue-600 mt-3">{generatedDocs}</p>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl group-hover:bg-blue-200/50 transition-colors duration-500"></div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/40 rounded-2xl border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h2 className="text-lg font-bold text-slate-800">Recent Projects</h2>
          <Link
            href="/projects/new"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            + New Project
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Consumer No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {recentProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No projects found.{' '}
                    <Link href="/projects/new" className="text-blue-600 hover:underline">
                      Create one
                    </Link>
                    .
                  </td>
                </tr>
              ) : (
                recentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors duration-150 group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors"
                      >
                        {project.customer.name}
                      </Link>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 font-mono bg-slate-50/50">
                      {project.customer.consumerNumber}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-700">
                      {project.projectCapacity} KW
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                          project.status === 'COMPLETED'
                            ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50'
                            : project.status === 'DOCUMENTS_GENERATED'
                            ? 'bg-blue-100/80 text-blue-700 border border-blue-200/50'
                            : project.status === 'APPROVED'
                            ? 'bg-indigo-100/80 text-indigo-700 border border-indigo-200/50'
                            : 'bg-amber-100/80 text-amber-700 border border-amber-200/50'
                        }`}
                      >
                        {project.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-emerald-600 hover:text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        {project.documents.length > 0
                          ? `View Docs (${project.documents.length})`
                          : 'View Project'}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
