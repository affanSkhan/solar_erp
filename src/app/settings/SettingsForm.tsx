'use client';

import { useState } from 'react';
import { updateVendorProfile } from './actions';

export function SettingsForm({ initialData, userId }: { initialData: any, userId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    formData.append('userId', userId);
    
    const result = await updateVendorProfile(formData);
    
    if (result.success) {
      setMessage('✅ Settings updated successfully!');
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-md text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input type="text" name="companyName" defaultValue={initialData?.companyName || ''} required className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
          <input type="text" name="ownerName" defaultValue={initialData?.ownerName || ''} required className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" defaultValue={initialData?.email || ''} required className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="text" name="phone" defaultValue={initialData?.phone || ''} required className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
          <input type="text" name="gstin" defaultValue={initialData?.gstin || ''} required className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
          <textarea name="address" rows={2} defaultValue={initialData?.address || ''} required className="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
