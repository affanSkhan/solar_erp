import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { SettingsForm } from './SettingsForm';

const prisma = new PrismaClient();

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/login');
  }
  const userId = (session.user as any).id;

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId },
  });

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Vendor Settings</h1>
        <p className="text-slate-500 mt-2 font-medium">
          Update your company details here. These details will be automatically injected into your generated documents. 
          If you leave this blank, the system will use the default Impress Solar Point details.
        </p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 p-8">
        <SettingsForm initialData={vendorProfile} userId={userId} />
      </div>
    </div>
  );
}
