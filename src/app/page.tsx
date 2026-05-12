import Link from 'next/link';
import { Prisma, PrismaClient, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Dashboard() {
  let totalProjects = 0;
  let pendingApprovals = 0;
  let generatedDocs = 0;
  let recentProjects: Prisma.ProjectGetPayload<{
    include: { customer: true; documents: true };
  }>[] = [];
  let dbUnavailable = false;

  try {
    totalProjects = await prisma.project.count();
    pendingApprovals = await prisma.project.count({
      where: { status: { notIn: [ProjectStatus.COMPLETED, ProjectStatus.DOCUMENTS_GENERATED, ProjectStatus.CREATED] } }
    });
    generatedDocs = await prisma.document.count();

    recentProjects = await prisma.project.findMany({
      orderBy: { installationDate: 'desc' },
      take: 10,
      include: {
        customer: true,
        documents: true,
      }
    });
  } catch (error) {
    dbUnavailable = true;
    console.error("Failed to load dashboard data from database:", error);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      {dbUnavailable ? (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Database is unavailable. Start PostgreSQL on <strong>localhost:5433</strong> to load live dashboard data.
        </div>
      ) : null}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Pending Approvals</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingApprovals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Documents Generated</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{generatedDocs}</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
          <Link href="/projects/new" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
            + New Project
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumer No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No projects found. Create one.</td>
                </tr>
              ) : (
                recentProjects.map(project => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.customer.consumerNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.projectCapacity} KW</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'DOCUMENTS_GENERATED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {project.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {project.documents.length > 0 ? (
                        <button className="text-blue-600 hover:text-blue-900">View Docs ({project.documents.length})</button>
                      ) : (
                        <span className="text-gray-400">No Docs</span>
                      )}
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
