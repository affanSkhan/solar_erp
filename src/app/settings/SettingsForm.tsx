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

    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const actionType = submitter?.value || 'lock'; // Default to lock since we only have one button now

    if (actionType === 'lock') {
      const isConfirmed = window.confirm(
        "⚠️ ARE YOU SURE?\n\nOnce you save, your company details will be PERMANENTLY LOCKED to prevent unauthorized changes.\n\nYou will not be able to edit this profile again without contacting the administrator. Do you wish to proceed?"
      );
      
      if (!isConfirmed) {
        setLoading(false);
        return;
      }
    }

    const formData = new FormData(e.currentTarget);
    formData.append('userId', userId);
    formData.append('actionType', actionType);
    
    const result = await updateVendorProfile(formData);
    
    if (result.success) {
      setMessage('✅ Settings updated successfully!');
      if (actionType === 'lock') {
        window.location.reload(); // Reload to show locked state
      }
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
    setLoading(false);
  };

  const isLocked = initialData?.isLocked;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-md text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {isLocked && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-amber-800 font-bold text-lg mb-1 flex items-center gap-2">
              Profile Locked
            </h3>
            <p className="text-amber-700 text-sm">Your company details are locked for security purposes and cannot be changed.</p>
          </div>
          <a 
            href="https://wa.me/918605203570" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#25D366]/20 transition-all duration-200 flex items-center gap-2"
          >
            Contact Admin to Unlock
          </a>
        </div>
      )}

      {/* Vendor / Company Details */}
      <div className={`p-6 rounded-2xl border transition-colors ${isLocked ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-slate-50/50 border-slate-100'}`}>
        <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          Company Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
            <input type="text" name="companyName" defaultValue={initialData?.companyName || ''} required disabled={isLocked} className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Owner Name</label>
            <input type="text" name="ownerName" defaultValue={initialData?.ownerName || ''} required disabled={isLocked} className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
            <input type="email" name="email" defaultValue={initialData?.email || ''} required disabled={isLocked} className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
            <input type="text" name="phone" defaultValue={initialData?.phone || ''} required disabled={isLocked} className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">GSTIN</label>
            <input type="text" name="gstin" defaultValue={initialData?.gstin || ''} required disabled={isLocked} className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Address</label>
            <textarea name="address" rows={2} defaultValue={initialData?.address || ''} required disabled={isLocked} className="appearance-none block w-full px-4 py-3 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
        </div>
      </div>

      {/* DISCOM / Licensee Section */}
      <div className={`p-6 rounded-2xl border transition-colors ${isLocked ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-slate-50/50 border-slate-100'}`}>
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
            <input type="text" name="discomName" defaultValue={initialData?.discomName || ''} disabled={isLocked} placeholder="e.g. MSEDCL" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">DISCOM Subdivision Address</label>
            <input type="text" name="discomAddress" defaultValue={initialData?.discomAddress || ''} disabled={isLocked} placeholder="e.g. MSEDCL Subdivision Daryapur" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Licensee Name</label>
            <input type="text" name="licenseeName" defaultValue={initialData?.licenseeName || ''} disabled={isLocked} placeholder="e.g. MSEDCL, Daryapur U-III" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Licensee Office / Location</label>
            <input type="text" name="licenseeAddress" defaultValue={initialData?.licenseeAddress || ''} disabled={isLocked} placeholder="e.g. Daryapur U-I S/DN" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white disabled:bg-slate-100 disabled:text-slate-500" />
          </div>
        </div>
      </div>

      {!isLocked && (
        <div className="flex justify-end pt-4 border-t border-slate-200 mt-8">
          <button
            type="submit"
            name="action"
            value="lock"
            disabled={loading}
            className="group relative flex justify-center py-3 px-8 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Processing...' : 'Save Settings and Lock'}
          </button>
        </div>
      )}
    </form>
  );
}
