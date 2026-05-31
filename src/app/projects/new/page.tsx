'use client';

import { useState } from 'react';

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/documents/generate-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok && res.headers.get('Content-Type')?.includes('zip')) {
        // Trigger ZIP download
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const disposition = res.headers.get('Content-Disposition') || '';
        const match = disposition.match(/filename="([^"]+)"/);
        a.download = match ? match[1] : 'solar_documents.zip';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setMessage('✅ Documents generated! Your ZIP download has started.');
      } else {
        const result = await res.json();
        setMessage(`Error: ${result.error}`);
      }
    } catch (err: any) {
      setMessage(`System Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Solar Project</h1>
        <p className="text-slate-500 mt-2 font-medium">Enter the project details below to automatically generate all required documents.</p>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-xl font-medium shadow-sm border ${message.includes('Error') ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200/50">

        {/* Customer Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Customer Name</label>
              <input required name="customer_name" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Consumer Number</label>
              <input required name="consumer_number" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="123456789012" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Address</label>
              <input required name="customer_address" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="123 Main Street, City 400001" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number</label>
              <input required name="mobile_number" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="9876543210" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
              <input name="email" type="email" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="john.doe@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Aadhaar Number</label>
              <input name="aadhaar_number" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="1234 5678 9012" />
            </div>
          </div>
        </div>

        {/* Project & Solar Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">Project &amp; Solar Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Project Capacity (KW)</label>
              <input required name="project_capacity" type="number" step="0.1" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="4" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Sanctioned Capacity (KW)</label>
              <input required name="sanctioned_capacity" type="number" step="0.1" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="5" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Installation Date</label>
              <input required name="installation_date" type="date" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Application Number</label>
              <input name="application_number" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="70803309" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Application Date</label>
              <input name="application_date" type="date" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Module Make</label>
              <input required name="module_make" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="WAAREE" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Module Model</label>
              <input name="module_model" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="BIN-M10-144-AAA" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Module Wattage (Wp)</label>
              <input required name="module_wattage" type="number" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="580" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Module Quantity</label>
              <input required name="module_quantity" type="number" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="7" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Total Module Capacity (KW)</label>
              <input required name="module_total_capacity" type="number" step="0.01" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="4.06" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Module Efficiency (%)</label>
              <input name="module_efficiency" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="22" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Inverter Make</label>
              <input required name="inverter_make" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="WAAREE" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Inverter Model</label>
              <input name="inverter_model" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="B05F502048TF379" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Inverter Capacity (KW)</label>
              <input required name="inverter_capacity" type="number" step="0.1" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="5" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Module Serial Numbers</label>
              <textarea name="module_serial_numbers" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="WS10259055293664, WS10259055293360, ..." rows={2} />
            </div>
          </div>
        </div>

        {/* Technical Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">Technical Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Manufacturing Year</label>
              <input name="manufacturing_year" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="2026" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Earthing Count</label>
              <input name="earthing_count" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="3" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Earth Resistance</label>
              <input name="earth_resistance" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="0.8 Ohm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Power Output Before</label>
              <input name="power_output_before" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="1605 watts" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Power Output After</label>
              <input name="power_output_after" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="000 watts" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Observation Date</label>
              <input name="observation_date" type="date" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Grid Side Voltage</label>
              <input name="grid_side_voltage" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="245" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Inverter Side Voltage</label>
              <input name="inverter_side_voltage" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="00" />
            </div>
          </div>
        </div>

        {/* Agreement Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">Agreement Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Agreement Date</label>
              <input name="agreement_date" type="date" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Agreement Cost (Rs.)</label>
              <input name="agreement_cost" type="text" className="appearance-none block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm transition-all duration-200 bg-white/50 focus:bg-white" placeholder="250000" />
            </div>
          </div>
        </div>

        <div className="pt-6 mt-10 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Processing & Generating Documents...' : 'Save Project & Generate Documents'}
          </button>
        </div>
      </form>
    </div>
  );
}
