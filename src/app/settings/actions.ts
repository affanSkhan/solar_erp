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

    const actionType = formData.get('actionType') as string;
    const isLocking = actionType === 'lock';

    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { userId }
    });

    if (existingProfile?.isLocked) {
      return { success: false, error: 'Your profile is locked. Please contact the administrator to make changes.' };
    }

    const data = {
      companyName: formData.get('companyName') as string,
      ownerName: formData.get('ownerName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      gstin: formData.get('gstin') as string,
      address: formData.get('address') as string,
      // DISCOM / Licensee (city-specific, optional)
      discomName:      (formData.get('discomName') as string)      || null,
      discomAddress:   (formData.get('discomAddress') as string)   || null,
      licenseeName:    (formData.get('licenseeName') as string)    || null,
      licenseeAddress: (formData.get('licenseeAddress') as string) || null,
      isLocked: isLocking
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
