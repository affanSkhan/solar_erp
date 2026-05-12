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
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      
      if (result.success) {
        if (result.failedTemplates?.length) {
          const failedNames = result.failedTemplates.map((f: any) => f.template).join(', ');
          setMessage(`Generated with warnings. Failed templates: ${failedNames}`);
        } else {
          setMessage('Documents successfully generated!');
        }
        // router.push(`/projects/${result.project.id}`);
      } else {
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Solar Project & Generate Docs</h1>
      
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
              <input name="email" type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="paradiseenergies@gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <input name="aadhaar_number" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="735512282942" />
            </div>
          </div>
        </div>

        {/* Project Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Project & Solar Details</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Module Efficiency (%)</label>
              <input name="module_efficiency" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="22" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Module Serial Numbers</label>
              <textarea name="module_serial_numbers" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="WS10259055293664, WS10259055293360, ..." rows={2} />
            </div>
          </div>
        </div>

        {/* Vendor Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Vendor Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
              <input name="vendor_name" type="text" defaultValue="PARADISE ENERGIES" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor Owner</label>
              <input name="vendor_owner" type="text" placeholder="Authorized Signatory" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Vendor Address</label>
              <input name="vendor_address" type="text" defaultValue="IN FRONT OF TAHESIL OFFICE, BARSHITAKLI Dist - AKOLA, Pin Code 444401" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor Phone</label>
              <input name="vendor_phone" type="text" defaultValue="7767037077" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor Email</label>
              <input name="vendor_email" type="email" defaultValue="paradiseenergies@gmail.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor GSTIN</label>
              <input name="vendor_gstin" type="text" defaultValue="27CLEPS3644D2Z1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
          </div>
        </div>

        {/* Technical/Regulatory Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Technical & Regulatory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Inverter Phase</label>
              <input name="inverter_phase" type="text" defaultValue="1ph" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grid Voltage</label>
              <input name="grid_voltage" type="text" defaultValue="230-240" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Inverter IP Rating</label>
              <input name="inverter_ip_rating" type="text" defaultValue="IP65" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Manufacturing Year</label>
              <input name="manufacturing_year" type="text" placeholder="2026" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Earthing Count</label>
              <input name="earthing_count" type="text" placeholder="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Earth Resistance</label>
              <input name="earth_resistance" type="text" placeholder="0.8 Ohm" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Power Output Before</label>
              <input name="power_output_before" type="text" placeholder="1605 watts" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Power Output After</label>
              <input name="power_output_after" type="text" placeholder="000 watts" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Observation Date</label>
              <input name="observation_date" type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grid Side Voltage</label>
              <input name="grid_side_voltage" type="text" placeholder="245" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Inverter Side Voltage</label>
              <input name="inverter_side_voltage" type="text" placeholder="00" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Fees</label>
              <input name="registration_fees" type="text" defaultValue="590" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
          </div>
        </div>

        {/* Agreement & Utility Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Agreement & Utility Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Agreement Date</label>
              <input name="agreement_date" type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Agreement Cost</label>
              <input name="agreement_cost" type="text" placeholder="250000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Maintenance Years</label>
              <input name="maintenance_years" type="text" defaultValue="5 years" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Performance Ratio</label>
              <input name="performance_ratio" type="text" defaultValue="75%" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">DISCOM Name</label>
              <input name="discom_name" type="text" defaultValue="MSEDCL" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Licensee Name</label>
              <input name="licensee_name" type="text" defaultValue="MSEDCL, AKOLA U-III S/DN AKOLA" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input name="location" type="text" defaultValue="AKOLA U-I S/DN" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Model</label>
              <input name="project_model" type="text" defaultValue="Capex" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">RE Arrangement Type</label>
              <input name="re_arrangement_type" type="text" defaultValue="Net Metering Arrangement" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">RE Source</label>
              <input name="re_source" type="text" defaultValue="Solar" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
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
