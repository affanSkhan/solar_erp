import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export default async function CustomersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  let customers: any[] = [];
  let dbUnavailable = false;

  try {
    if (userId) {
      customers = await prisma.customer.findMany({
        where: { projects: { some: { userId } } },
        include: { projects: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch {
    dbUnavailable = true;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Customers Directory</h1>
        <Link
          href="/projects/new"
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
        >
          + New Project
        </Link>
      </div>

      {dbUnavailable && (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Database is unavailable. Start PostgreSQL on <strong>localhost:5433</strong>.
        </div>
      )}

      <div className="bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/40 rounded-2xl border border-slate-200/60 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Consumer No.</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Projects</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  No customers found.{' '}
                  <Link href="/projects/new" className="text-blue-600 hover:underline">
                    Create a project
                  </Link>{' '}
                  to add customers.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors duration-150 group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-800">{customer.name}</div>
                    {customer.email && (
                      <div className="text-xs font-medium text-slate-500 mt-0.5">{customer.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500 font-mono bg-slate-50/50">
                    {customer.consumerNumber}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-700">
                    {customer.mobile}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600 max-w-xs truncate">
                    {customer.address}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                    <span className="px-3 py-1 bg-emerald-50/80 text-emerald-700 border border-emerald-200/50 rounded-full text-xs font-bold">
                      {customer.projects.length} project{customer.projects.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {customer.projects.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/projects/${p.id}`}
                        className="text-emerald-600 hover:text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        View Project
                      </Link>
                    ))}
                    {customer.projects.length === 0 && (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Total: {customers.length} customer{customers.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
