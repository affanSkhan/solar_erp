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
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Solar Project &amp; Generate Docs</h1>

      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">

        {/* Customer Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input required name="customer_name" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="ASHFAQUE HUSAIN KHAN" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Consumer Number</label>
              <input required name="consumer_number" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="310071314005" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input required name="customer_address" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="FIRDOUS COLONY, AKOLA 444001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input required name="mobile_number" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="9545956663" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="customer@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <input name="aadhaar_number" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="735512282942" />
            </div>
          </div>
        </div>

        {/* Project & Solar Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Project &amp; Solar Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Capacity (KW)</label>
              <input required name="project_capacity" type="number" step="0.1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sanctioned Capacity (KW)</label>
              <input required name="sanctioned_capacity" type="number" step="0.1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Installation Date</label>
              <input required name="installation_date" type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Application Number</label>
              <input name="application_number" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="70803309" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Application Date</label>
              <input name="application_date" type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Module Make</label>
              <input required name="module_make" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="WAAREE" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Module Model</label>
              <input name="module_model" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="BIN-M10-144-AAA" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Module Wattage (Wp)</label>
              <input required name="module_wattage" type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="580" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Module Quantity</label>
              <input required name="module_quantity" type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="7" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Module Capacity (KW)</label>
              <input required name="module_total_capacity" type="number" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="4.06" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Module Efficiency (%)</label>
              <input name="module_efficiency" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="22" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Inverter Make</label>
              <input required name="inverter_make" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="WAAREE" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Inverter Model</label>
              <input name="inverter_model" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="B05F502048TF379" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Inverter Capacity (KW)</label>
              <input required name="inverter_capacity" type="number" step="0.1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="5" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Module Serial Numbers</label>
              <textarea name="module_serial_numbers" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="WS10259055293664, WS10259055293360, ..." rows={2} />
            </div>
          </div>
        </div>

        {/* Technical Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Technical Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Manufacturing Year</label>
              <input name="manufacturing_year" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Earthing Count</label>
              <input name="earthing_count" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Earth Resistance</label>
              <input name="earth_resistance" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="0.8 Ohm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Power Output Before</label>
              <input name="power_output_before" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="1605 watts" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Power Output After</label>
              <input name="power_output_after" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="000 watts" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Observation Date</label>
              <input name="observation_date" type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grid Side Voltage</label>
              <input name="grid_side_voltage" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="245" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Inverter Side Voltage</label>
              <input name="inverter_side_voltage" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="00" />
            </div>
          </div>
        </div>

        {/* Agreement Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Agreement Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Agreement Date</label>
              <input name="agreement_date" type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Agreement Cost (Rs.)</label>
              <input name="agreement_cost" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="250000" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Processing & Generating Documents...' : 'Save Project & Generate Documents'}
          </button>
        </div>
      </form>
    </div>
  );
}
