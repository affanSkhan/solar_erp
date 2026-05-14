import type { DocumentContext } from './documentGenerator';

export const DEFAULTS = {
  vendorName: 'PARADISE ENERGIES',
  vendorAddress: 'IN FRONT OF TAHESIL OFFICE, BARSHITAKLI Dist - AKOLA, Pin Code 444401',
  vendorPhone: '+917744819280',
  vendorEmail: 'munavvarhussain445@gmail.com',
  vendorGstin: '27CLEPS3644D2Z1',
  vendorOwner: 'Authorized Signatory',
  discomName: 'MSEDCL',
  licenseeName: 'MSEDCL, AKOLA U-III S/DN AKOLA',
  location: 'AKOLA U-I S/DN',
  reArrangementType: 'Net Metering Arrangement',
  reSource: 'Solar',
  projectModel: 'Capex',
  inverterPhase: '1ph',
  gridVoltage: '230-240',
  inverterIpRating: 'IP65',
  maintenanceYears: '5 years',
  performanceRatio: '75%',
  registrationFees: '590',
} as const;

export function text(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : fallback;
}

export function numberText(value: unknown, fallback = '0'): string {
  const raw = text(value, fallback).replace(/,/g, '').trim();
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return String(n);
}

export function integerText(value: unknown, fallback = '0'): string {
  const raw = text(value, fallback).replace(/,/g, '').trim();
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return String(Math.trunc(n));
}

export function withUnit(value: unknown, unit: string, fallback = ''): string {
  const n = numberText(value, '');
  if (!n) return fallback;
  return `${n} ${unit}`;
}

export function parseDateInput(value: unknown): Date | null {
  const v = text(value);
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const parsed = new Date(`${v}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const dm = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (dm) {
    const parsed = new Date(`${dm[3]}-${dm[2]}-${dm[1]}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const generic = new Date(v);
  return Number.isNaN(generic.getTime()) ? null : generic;
}

export function formatDateForDocs(value: unknown): string {
  const parsed = parseDateInput(value);
  if (!parsed) return '';
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = String(parsed.getFullYear());
  return `${day}/${month}/${year}`;
}

export function yearFromDate(value: unknown): string {
  const parsed = parseDateInput(value);
  if (!parsed) return '';
  return String(parsed.getFullYear());
}

export function validatePayload(data: Record<string, unknown>): string[] {
  const requiredFields = [
    'customer_name', 'consumer_number', 'customer_address', 'mobile_number',
    'project_capacity', 'sanctioned_capacity', 'installation_date',
    'module_make', 'module_wattage', 'module_quantity', 'module_total_capacity',
    'inverter_make', 'inverter_capacity',
  ];
  const missing: string[] = [];
  for (const field of requiredFields) {
    if (!text(data[field])) missing.push(field);
  }
  return missing;
}

export function buildDocumentContext(data: Record<string, unknown>): DocumentContext {
  const installationDate = formatDateForDocs(data.installation_date);
  const applicationDate = formatDateForDocs(data.application_date || data.installation_date);
  const observationDate = formatDateForDocs(data.observation_date || data.installation_date);
  const projectCapacity = numberText(data.project_capacity);
  const sanctionedCapacity = numberText(data.sanctioned_capacity);
  const moduleWattage = numberText(data.module_wattage);
  const moduleTotalCapacity = numberText(data.module_total_capacity);
  const inverterCapacity = numberText(data.inverter_capacity);
  const gridVoltage = text(data.grid_voltage, DEFAULTS.gridVoltage);

  return {
    customer_name: text(data.customer_name),
    consumer_number: text(data.consumer_number),
    customer_address: text(data.customer_address),
    mobile_number: text(data.mobile_number),
    email: text(data.email),
    aadhaar_number: text(data.aadhaar_number),

    project_capacity: projectCapacity,
    sanctioned_capacity: sanctionedCapacity,
    project_capacity_display: `${projectCapacity} KW`,
    sanctioned_capacity_display: `${sanctionedCapacity} KW`,
    installation_date: installationDate,
    application_number: text(data.application_number),
    application_date: applicationDate,
    project_model: text(data.project_model, DEFAULTS.projectModel),
    re_arrangement_type: text(data.re_arrangement_type, DEFAULTS.reArrangementType),
    re_source: text(data.re_source, DEFAULTS.reSource),

    vendor_name: text(data.vendor_name, DEFAULTS.vendorName),
    vendor_address: text(data.vendor_address, DEFAULTS.vendorAddress),
    vendor_phone: text(data.vendor_phone, DEFAULTS.vendorPhone),
    vendor_email: text(data.vendor_email, DEFAULTS.vendorEmail),
    vendor_gstin: text(data.vendor_gstin, DEFAULTS.vendorGstin),
    vendor_owner: text(data.vendor_owner, DEFAULTS.vendorOwner),

    module_make: text(data.module_make),
    module_model: text(data.module_model),
    module_wattage: moduleWattage,
    module_wattage_display: `${moduleWattage} WP`,
    module_quantity: integerText(data.module_quantity),
    module_total_capacity: moduleTotalCapacity,
    module_total_capacity_display: `${moduleTotalCapacity} KW`,
    module_efficiency: text(data.module_efficiency, '0'),
    module_efficiency_display: `${text(data.module_efficiency, '0')}%`,
    module_serial_numbers: text(data.module_serial_numbers),

    inverter_make: text(data.inverter_make),
    inverter_model: text(data.inverter_model),
    inverter_capacity: inverterCapacity,
    inverter_capacity_display: `${inverterCapacity} KW`,
    inverter_phase: text(data.inverter_phase, DEFAULTS.inverterPhase),
    grid_voltage: gridVoltage,
    grid_voltage_display: /v$/i.test(gridVoltage) ? gridVoltage : `${gridVoltage} V`,
    inverter_ip_rating: text(data.inverter_ip_rating, DEFAULTS.inverterIpRating),
    manufacturing_year: text(data.manufacturing_year, yearFromDate(data.installation_date)),

    earthing_count: text(data.earthing_count, '0'),
    earth_resistance: text(data.earth_resistance, '0 Ohm'),
    power_output_before: text(data.power_output_before, '0 Watts'),
    power_output_after: text(data.power_output_after, '0 Watts'),
    grid_side_voltage: text(data.grid_side_voltage, '0 V'),
    inverter_side_voltage: text(data.inverter_side_voltage, '0 V'),
    earthing_display: `${text(data.earthing_count, '0')} Nos, ${text(data.earth_resistance, '0 Ohm')}`,
    power_output_before_display: withUnit(data.power_output_before, 'Watts', '0 Watts'),
    power_output_after_display: withUnit(data.power_output_after, 'Watts', '0 Watts'),
    grid_side_voltage_display: withUnit(data.grid_side_voltage, 'V', '0 V'),
    inverter_side_voltage_display: withUnit(data.inverter_side_voltage, 'V', '0 V'),

    agreement_date: formatDateForDocs(data.agreement_date || data.installation_date),
    agreement_cost: text(data.agreement_cost, '0'),
    agreement_cost_display: `Rs. ${numberText(data.agreement_cost, '0')}`,
    maintenance_years: text(data.maintenance_years, DEFAULTS.maintenanceYears),
    performance_ratio: text(data.performance_ratio, DEFAULTS.performanceRatio),

    discom_name: text(data.discom_name, DEFAULTS.discomName),
    location: text(data.location, DEFAULTS.location),
    licensee_name: text(data.licensee_name, DEFAULTS.licenseeName),
    registration_fees: text(data.registration_fees, DEFAULTS.registrationFees),
    observation_date: observationDate,
  };
}
