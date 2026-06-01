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
    const actionType = submitter?.value || 'save';

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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
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
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>
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
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-slate-200 mt-8">
          <button
            type="submit"
            name="action"
            value="save"
            disabled={loading}
            className="group relative flex justify-center py-3 px-6 border border-slate-300 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          
          <button
            type="submit"
            name="action"
            value="lock"
            disabled={loading}
            className="group relative flex justify-center py-3 px-8 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none gap-2 items-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            {loading ? 'Processing...' : 'Save Settings and Lock'}
          </button>
        </div>
      )}
    </form>
  );
}
