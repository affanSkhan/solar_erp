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
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vendor Settings</h1>
      <p className="text-gray-500 mb-6">
        Update your company details here. These details will be automatically injected into your generated documents. 
        If you leave this blank, the system will use the default Impress Solar Point details.
      </p>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <SettingsForm initialData={vendorProfile} userId={userId} />
      </div>
    </div>
  );
}
