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
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-md text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Vendor / Company Details */}
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          Company Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
            <input type="text" name="companyName" defaultValue={initialData?.companyName || ''} required className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Owner Name</label>
            <input type="text" name="ownerName" defaultValue={initialData?.ownerName || ''} required className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
            <input type="email" name="email" defaultValue={initialData?.email || ''} required className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
            <input type="text" name="phone" defaultValue={initialData?.phone || ''} required className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">GSTIN</label>
            <input type="text" name="gstin" defaultValue={initialData?.gstin || ''} required className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Address</label>
            <textarea name="address" rows={2} defaultValue={initialData?.address || ''} required className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white" />
          </div>
        </div>
      </div>

      {/* DISCOM / Licensee Section */}
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          DISCOM / Licensee Details
        </h3>
        <p className="text-sm text-slate-500 mb-5 font-medium">
          These details appear in the Net Metering Agreement, Islanding Certificate, and other documents.
          Leave blank to use system defaults. Set these if your office is in a different city.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">DISCOM Name</label>
            <input type="text" name="discomName" defaultValue={initialData?.discomName || ''} placeholder="e.g. MSEDCL" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">DISCOM Subdivision Address</label>
            <input type="text" name="discomAddress" defaultValue={initialData?.discomAddress || ''} placeholder="e.g. MSEDCL Subdivision Daryapur" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Licensee Name</label>
            <input type="text" name="licenseeName" defaultValue={initialData?.licenseeName || ''} placeholder="e.g. MSEDCL, Daryapur U-III" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Licensee Office / Location</label>
            <input type="text" name="licenseeAddress" defaultValue={initialData?.licenseeAddress || ''} placeholder="e.g. Daryapur U-I S/DN" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="group relative flex justify-center py-3 px-8 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
