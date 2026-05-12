const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const templatesDir = path.join(__dirname, 'templates');

const commonReplacements = [
  { old: 'A SHFAQUE HUSAIN KHAN ALTAF HUSAIN KHAN', new: '{{customer_name}}' },
  { old: 'ASHFAQUE HUSAIN KHAN ALTAF HUSAIN KHAN', new: '{{customer_name}}' },
  { old: 'ASHFAQUE HUSAIN K HAN ALTAF HUSAIN KHAN', new: '{{customer_name}}' },
  { old: 'ASHFAQUE HUSAIN KHAN', new: '{{customer_name}}' },
  { old: 'ASHFAQUE  HUSAIN', new: '{{customer_name}}' },
  { old: 'ASHFAQUE HUSAIN', new: '{{customer_name}}' },
  { old: 'ASHFAQUE', new: '{{customer_name}}' },
  { old: 'ALTAF HUSAIN KHAN', new: '{{customer_name}}' },
  { old: 'KHAN ALTAF HUSAIN KHAN', new: '' },
  { old: 'KHAN ALTAF HUSAIN  KHAN', new: '' },
  { old: 'ALTAF HUSAIN  KHAN', new: '' },
  { old: 'ALTAF  HUSAIN  KHAN', new: '' },
  { old: '310071314005', new: '{{consumer_number}}' },
  { old: '31007 131400 5', new: '{{consumer_number}}' },
  { old: '31007131400 5', new: '{{consumer_number}}' },
  { old: '3 10071314005', new: '{{consumer_number}}' },
  { old: '9545956663', new: '{{mobile_number}}' },
  { old: '9 545956663', new: '{{mobile_number}}' },
  { old: 'paradiseenergies@gmail.com', new: '{{email}}' },
  { old: 'FIRDOUS COLONY, AKOLA 444001', new: '{{customer_address}}' },
  { old: 'FIRDOUS COLONY , AKOLA 444001', new: '{{customer_address}}' },
  { old: 'FRIDOUS COLONY , AKOLA 444001', new: '{{customer_address}}' },
  { old: 'FIRDOUS COLONY,NEAR JAFAR NAGAR, AKOLA  444001', new: '{{customer_address}}' },
  { old: 'FIRDOUS COLONY,NEAR JAFAR NAGAR, AKOLA \u00A0444001', new: '{{customer_address}}' },
  { old: 'PARADISE ENERGIES', new: '{{vendor_name}}' },
  { old: 'PARADISE ENERGIE S', new: '{{vendor_name}}' },
  { old: '7767037077', new: '{{vendor_phone}}' },
  { old: '27CLEPS3644D2Z1', new: '{{vendor_gstin}}' },
  { old: '27CLEPS3644D2 Z 1', new: '{{vendor_gstin}}' },
  { old: 'WAAREE', new: '{{module_make}}' }
];

const templateReplacements = {
  'ANNEXURE_I_template.docx': [
    { old: 'Email Id{{email}}', new: 'Email Id{{email}}' },
    { old: 'RE Arrangement Type      Net Metering Arrangement', new: 'RE Arrangement Type{{re_arrangement_type}}' },
    { old: 'RE SourceSolar', new: 'RE Source{{re_source}}' },
    { old: 'Sanctioned Capacity (Kw)5 KW', new: 'Sanctioned Capacity (Kw){{sanctioned_capacity}}' },
    { old: 'Project ModelCapex', new: 'Project Model{{project_model}}' },
    { old: 'RE Installed Capacity (Rooftop) (Kw)4 KW', new: 'RE Installed Capacity (Rooftop) (Kw){{project_capacity}}' },
    { old: 'Installation Date23/11/2025', new: 'Installation Date{{installation_date}}' },
    { old: 'Solar PV Details{{module_make}}', new: 'Solar PV Details{{module_make}}' },
    { old: 'Inverter Capacity (Kw)5 KW', new: 'Inverter Capacity (Kw){{inverter_capacity}}' },
    { old: 'Inverter Make{{module_make}}', new: 'Inverter Make{{inverter_make}}' },
    { old: 'No. of PV Modules7', new: 'No. of PV Modules{{module_quantity}}' },
    { old: 'Module Capacity (Kw)580 WP', new: 'Module Capacity (Kw){{module_wattage}}' },
    { old: 'Certified that a Grid Connected SPV Power Plant of  -- 4 KW capacity', new: 'Certified that a Grid Connected SPV Power Plant of -- {{project_capacity}} capacity' },
    { old: 'installed  by  {{vendor_name}} on 23/11/2025', new: 'installed by {{vendor_name}} on {{installation_date}}' }
  ],
  'WCR_ISLANDING_template.docx': [
    { old: '5Sanction number -', new: '5Sanction number {{application_number}}' },
    { old: '6Sanctioned Capacity of solar PV system (KW) 5 KW', new: '6Sanctioned Capacity of solar PV system (KW) {{sanctioned_capacity}}' },
    { old: 'Capacity of solar PV system (KW)4 KW', new: 'Capacity of solar PV system (KW){{project_capacity}}' },
    { old: 'ALMM Model NumberBIN-M10-144-AAA', new: 'ALMM Model Number{{module_model}}' },
    { old: 'Wattage per module580 WP', new: 'Wattage per module{{module_wattage}}' },
    { old: 'No. of Module7', new: 'No. of Module{{module_quantity}}' },
    { old: 'Total Capacity ( KW )4 KW', new: 'Total Capacity ( KW ){{module_total_capacity}}' },
    { old: 'Make & Model Number of Inverter{{module_make}}', new: 'Make & Model Number of Inverter{{inverter_make}} {{inverter_model}}' },
    { old: 'Rating IP 65', new: 'Rating {{inverter_ip_rating}}' },
    { old: 'Capacity of Inverter5 KW', new: 'Capacity of Inverter{{inverter_capacity}}' },
    { old: 'HPD - Year of manufacturing2025', new: 'HPD - Year of manufacturing{{manufacturing_year}}' },
    { old: 'HPD-Year of manufacturing20259Earthing', new: 'HPD-Year of manufacturing{{manufacturing_year}}9Earthing' },
    { old: 'Year of manufacturing2025', new: 'Year of manufacturing{{manufacturing_year}}' },
    { old: 'No. of Separate Earthing with earth resistance3 and 0.8 Ohm resistance', new: 'No. of Separate Earthing with earth resistance{{earthing_count}} and {{earth_resistance}}' },
    { old: 'We     {{vendor_name}} &   {{customer_name}}', new: 'We {{vendor_name}} & {{customer_name}}' },
    { old: 'Aadhar Number  :-    7355  1228  2942', new: 'Aadhar Number :- {{aadhaar_number}}' }
  ],
  'MODEL_AG_template.docx': [
    { old: 'This agreement is executed on       06    (Day)       12       (Month)     2025     (Year)', new: 'This agreement is executed on {{agreement_date}}' },
    { old: 'This agreement is executed on        06      (Day)          12           (Month)      2025       (Year)', new: 'This agreement is executed on {{agreement_date}}' },
    { old: 'consumer number     {{consumer_number}}  from  _MSEDCL_   _(DISCOM) at    AKOLA', new: 'consumer number {{consumer_number}} from {{discom_name}} (DISCOM) at {{location}}' },
    { old: 'consumer number       {{consumer_number}}    from    _ MSE DCL _     _ (DISCOM) at      AKOLA', new: 'consumer number {{consumer_number}} from {{discom_name}} (DISCOM) at {{location}}' },
    { old: 'and is having registered/functional office at      AKOLA', new: 'and is having registered/functional office at {{vendor_address}}' },
    { old: 'and is having registered/functional office at        AKOLA', new: 'and is having registered/functional office at {{vendor_address}}' },
    { old: 'minimum __ 4 KW', new: 'minimum __ {{project_capacity}}' },
    { old: 'minimum __4 KW', new: 'minimum {{project_capacity}}' },
    { old: 'Solar modules of __{{module_make}}__make, __DCR_________model, ____580_____Wp capacity each and __22___% efficiency', new: 'Solar modules of {{module_make}} make, {{module_model}} model, {{module_wattage}} Wp capacity each and {{module_efficiency}}% efficiency' },
    { old: 'Solar inverter of_{{module_make}}__ make, B05F502048TF379___model,_5KW_rated output capacity', new: 'Solar inverter of {{inverter_make}} make, {{inverter_model}} model, {{inverter_capacity}} rated output capacity' },
    { old: 'Solar inverter of_{{module_make}}__ make, B05F502048TF379___model,_5 KW_ rated output capacity', new: 'Solar inverter of {{inverter_make}} make, {{inverter_model}} model, {{inverter_capacity}} rated output capacity' },
    { old: 'The cost of RTS System will be Rs. _2,50,000___', new: 'The cost of RTS System will be Rs. {{agreement_cost}}' },
    { old: 'The cost of RTS System will be Rs. _   2,50,000___(to be decided mutually).', new: 'The cost of RTS System will be Rs. {{agreement_cost}} (to be decided mutually).' },
    { old: 'five years comprehensive maintenance', new: '{{maintenance_years}} comprehensive maintenance' },
    { old: 'minimum system performance ratio of 75%', new: 'minimum system performance ratio of {{performance_ratio}}' },
    { old: 'Vendor guarantees minimum system performance ratio of 75% as per performance ratio test', new: 'Vendor guarantees minimum system performance ratio of {{performance_ratio}} as per performance ratio test' }
  ],
  'Islanding_Certificate_template.docx': [
    { old: 'Name of Consumer :-  {{customer_name}}', new: 'Name of Consumer :- {{customer_name}}' },
    { old: 'Address :- {{customer_address}}', new: 'Address :- {{customer_address}}' },
    { old: 'Consumer Number :- {{consumer_number}}', new: 'Consumer Number :- {{consumer_number}}' },
    { old: 'Sanction Load :-  5 KW', new: 'Sanction Load :- {{sanctioned_capacity}}' },
    { old: 'Voltage Level :- 230-240 volt', new: 'Voltage Level :- {{grid_voltage}}' },
    { old: 'Application Number and Date :-      70803309  … 23 / 11 / 2025', new: 'Application Number and Date :- {{application_number}} {{application_date}}' },
    { old: 'Registration Fees paid :- 590', new: 'Registration Fees paid :- {{registration_fees}}' },
    { old: 'Inverter{{module_make}}  Inverter  5 KW1ph230-240', new: 'Inverter{{inverter_make}} {{inverter_model}} {{inverter_capacity}}{{inverter_phase}}{{grid_voltage}}' },
    { old: 'Solar Panels{{module_make}}  PANEL 4 KW', new: 'Solar Panels{{module_make}} {{module_model}} {{module_total_capacity}}' },
    { old: '7x 580 WP 4060 W', new: '{{module_quantity}}x{{module_wattage}} {{module_total_capacity}}' },
    { old: 'Contact No:  {{vendor_phone}} GSTIN   :   {{vendor_gstin}}', new: 'Contact No: {{vendor_phone}} GSTIN : {{vendor_gstin}}' },
    { old: 'Email - {{email}}', new: 'Email - {{vendor_email}}' },
    { old: '1605 watts power output at inverter.', new: '{{power_output_before}} power output at inverter.' },
    { old: '000 watts.', new: '{{power_output_after}}.' },
    { old: 'R-N24500', new: 'R-N{{grid_side_voltage}}{{inverter_side_voltage}}' },
    { old: 'the above parameters are observed on date        /      /  2025', new: 'the above parameters are observed on date {{observation_date}}' }
  ],
  'DCR_DECLARATION_template.docx': [
    { old: 'M /S   {{vendor_name}}   has   installed   4  K W  Grid Connected Rooftop Solar PV Power Plant  For      {{customer_name}}', new: 'M /S {{vendor_name}} has installed {{project_capacity}} Grid Connected Rooftop Solar PV Power Plant For {{customer_name}}' },
    { old: 'M/S {{vendor_name}} has installed 4 KW Grid Connected Rooftop Solar PV Power Plant For   {{customer_name}}', new: 'M/S {{vendor_name}} has installed {{project_capacity}} Grid Connected Rooftop Solar PV Power Plant For {{customer_name}}' },
    { old: 'under   sanction   number   Akola U-I  S/DN  /  Akola Urban   /  70803309   dated   23/11/2025', new: 'under sanction number {{application_number}} dated {{application_date}}' },
    { old: 'under sanction number Akola U-I S/DN / Akola Urban / 70803309 dated 23/11/2025', new: 'under sanction number {{application_number}} dated {{application_date}}' },
    { old: 'PV Module   Capacity :  580   WP', new: 'PV Module Capacity : {{module_wattage}}' },
    { old: 'PV Module Capacity: 580 WP', new: 'PV Module Capacity: {{module_wattage}}' },
    { old: 'Number   of   PV  Modules :  7   Nos.', new: 'Number of PV Modules : {{module_quantity}}' },
    { old: 'Number of PV Modules: 7 Nos.', new: 'Number of PV Modules: {{module_quantity}}' },
    { old: 'Sr   No of   PV  Module                         :  - WS10259055293664WS10259055293360WS10259055293630WS10259055293600WS10259055293635WS10259055293625WS10259055293648', new: 'Sr No of PV Module : {{module_serial_numbers}}' },
    { old: 'Sr No of PV Module                       : -WS10259055293664WS10259055293360WS10259055293630WS10259055293600WS10259055293635WS10259055293625WS10259055293648', new: 'Sr No of PV Module : {{module_serial_numbers}}' },
    { old: 'PV Module   Make : {{module_make}} ( {{module_make}} ENERGIES PVT LTD )', new: 'PV Module Make : {{module_make}}' },
    { old: 'PV Module Make: {{module_make}} ( {{module_make}} ENERGIES PVT LTD )', new: 'PV Module Make: {{module_make}}' },
    { old: 'I We {{customer_name}} , on behalf of     M/ S PARADIE ENERGIES', new: 'I We {{vendor_owner}} , on behalf of M/S {{vendor_name}}' },
    { old: 'I We  {{customer_name}} , on behalf of  M/S PARADIE ENERGIES', new: 'I We {{vendor_owner}} , on behalf of M/S {{vendor_name}}' },
    { old: 'Phone Number             :-  {{vendor_phone}}', new: 'Phone Number :- {{vendor_phone}}' },
    { old: 'Phone             :-  {{vendor_phone}}', new: 'Phone :- {{vendor_phone}}' },
    { old: 'Email:                 :-  {{email}}', new: 'Email :- {{vendor_email}}' },
    { old: 'Name             :-  MOHD HAKEEM AJMAL', new: 'Name :- {{vendor_owner}}' }
  ],
  'Net_Metering_Agreement_template.docx': [
    { old: '(location) 4275 : AKOLA U-I  S/DN', new: '(location) {{location}}' },
    { old: '(location) 4275 : AKOLA U-I  S/DN', new: '(location) {{location}}' },
    { old: 'onthis Date 23/11/2025', new: 'on this Date {{agreement_date}}' },
    { old: 'having premises at (address) {{customer_address}}', new: 'having premises at (address) {{customer_address}}' },
    { old: 'The Distribution Licensee MSEDCL , AKOLA U-III S/DN AKOLA', new: 'The Distribution Licensee {{licensee_name}}' },
    { old: 'having its Registered Office at 4275 : AKOLA  U-I S/DN , AKOLA', new: 'having its Registered Office at {{location}}' },
    { old: 'having its Registered Office at 4275 : AKOLA U-I S/DN , AKOLA', new: 'having its Registered Office at {{location}}' },
    { old: 'Roof-top Solar PV System of v 4 KW', new: 'Roof-top Solar PV System of {{project_capacity}}' },
    { old: 'Roof-top Solar PV System of v  4 KW', new: 'Roof-top Solar PV System of {{project_capacity}}' },
    { old: 'Roof-top Solar PV System of v {{project_capacity}}', new: 'Roof-top Solar PV System of {{project_capacity}}' }
  ]
};

function getTextNodes(xmlDoc) {
  return Array.from(xmlDoc.getElementsByTagName('w:t'));
}

function replaceAcrossTextNodes(xmlDoc, oldText, newText) {
  if (!oldText || oldText === newText) return 0;
  const nodes = getTextNodes(xmlDoc);
  if (!nodes.length) return 0;

  let replacements = 0;
  let guard = 0;

  while (guard < 2000) {
    guard += 1;
    const values = nodes.map((n) => n.textContent || '');
    const full = values.join('');
    const idx = full.indexOf(oldText);
    if (idx === -1) break;

    const targetEnd = idx + oldText.length;
    let startIndex = -1;
    let endIndex = -1;
    let startOffset = 0;
    let endOffset = 0;

    let cursor = 0;
    for (let i = 0; i < values.length; i += 1) {
      const v = values[i];
      const next = cursor + v.length;

      if (startIndex === -1 && idx >= cursor && idx < next) {
        startIndex = i;
        startOffset = idx - cursor;
      }
      if (targetEnd > cursor && targetEnd <= next) {
        endIndex = i;
        endOffset = targetEnd - cursor;
        break;
      }
      cursor = next;
    }

    if (startIndex === -1 || endIndex === -1) break;

    if (startIndex === endIndex) {
      const n = nodes[startIndex];
      const t = n.textContent || '';
      n.textContent = t.slice(0, startOffset) + newText + t.slice(endOffset);
    } else {
      const startNode = nodes[startIndex];
      const endNode = nodes[endIndex];
      const startText = startNode.textContent || '';
      const endText = endNode.textContent || '';

      startNode.textContent = startText.slice(0, startOffset) + newText;
      for (let i = startIndex + 1; i < endIndex; i += 1) {
        nodes[i].textContent = '';
      }
      endNode.textContent = endText.slice(endOffset);
    }

    replacements += 1;
  }

  return replacements;
}

function processTemplates() {
  const files = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.docx') && !f.startsWith('~$'));

  for (const file of files) {
    const filePath = path.join(templatesDir, file);
    const content = fs.readFileSync(filePath, 'binary');
    const zip = new PizZip(content);
    const docSpecific = templateReplacements[file] || [];
    const replacements = [...commonReplacements, ...docSpecific];

    let fileModified = false;

    for (const entryName of Object.keys(zip.files)) {
      if (!entryName.endsWith('.xml')) continue;

      const xml = zip.files[entryName].asText();
      if (!xml.includes('w:t')) continue;

      const xmlDoc = new DOMParser().parseFromString(xml, 'application/xml');
      const parserErrors = xmlDoc.getElementsByTagName('parsererror');
      if (parserErrors && parserErrors.length > 0) {
        continue;
      }

      let xmlReplacements = 0;
      for (const rep of replacements) {
        xmlReplacements += replaceAcrossTextNodes(xmlDoc, rep.old, rep.new);
      }

      if (xmlReplacements > 0) {
        const serialized = new XMLSerializer().serializeToString(xmlDoc);
        zip.file(entryName, serialized);
        fileModified = true;
      }
    }

    if (fileModified) {
      const buf = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
      fs.writeFileSync(filePath, buf);
      console.log(`Updated ${file}`);
    } else {
      console.log(`No changes needed for ${file}`);
    }
  }
}

processTemplates();
