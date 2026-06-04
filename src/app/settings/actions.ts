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

    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { userId }
    });

    // If profile is locked, only DISCOM fields are allowed to be updated
    if (existingProfile?.isLocked) {
      if (actionType === 'discom') {
        // Allow updating DISCOM / Licensee fields only
        await prisma.vendorProfile.update({
          where: { userId },
          data: {
            discomName:      (formData.get('discomName') as string)      || null,
            discomAddress:   (formData.get('discomAddress') as string)   || null,
            licenseeName:    (formData.get('licenseeName') as string)    || null,
            licenseeAddress: (formData.get('licenseeAddress') as string) || null,
          }
        });
        revalidatePath('/settings');
        return { success: true };
      } else {
        return { success: false, error: 'Your company details are locked. Please contact the administrator to make changes.' };
      }
    }

    // Profile is NOT locked — save everything
    const isLocking = actionType === 'lock';

    const data = {
      companyName: formData.get('companyName') as string,
      ownerName: formData.get('ownerName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      gstin: formData.get('gstin') as string,
      address: formData.get('address') as string,
      discomName:      (formData.get('discomName') as string)      || null,
      discomAddress:   (formData.get('discomAddress') as string)   || null,
      licenseeName:    (formData.get('licenseeName') as string)    || null,
      licenseeAddress: (formData.get('licenseeAddress') as string) || null,
      isLocked: isLocking,
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
