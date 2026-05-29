'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateVendorProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const userId = (session.user as any).id;
    const submittedUserId = formData.get('userId') as string;

    if (userId !== submittedUserId) {
      return { success: false, error: 'Invalid user session' };
    }

    const data = {
      companyName: formData.get('companyName') as string,
      ownerName: formData.get('ownerName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      gstin: formData.get('gstin') as string,
      address: formData.get('address') as string,
    };

    await prisma.vendorProfile.upsert({
      where: { userId },
      update: data,
      create: { ...data, userId },
    });

    revalidatePath('/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update profile:', error);
    return { success: false, error: error.message };
  }
}
