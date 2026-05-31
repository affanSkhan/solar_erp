import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
// In a full environment, you would use libreoffice or unoconv to handle PDF conversion.
// e.g. import { execSync } from 'child_process';

export type DocumentContext = Record<string, string>;

export const TEMPLATE_FILES = [
  'ANNEXURE_I_template.docx',
  'MODEL_AG_template.docx',
  'Net_Metering_Agreement_template.docx',
  'DCR_DECLARATION_template.docx',
  'Islanding_Certificate_template.docx',
  'WCR_ISLANDING_template.docx'
] as const;

const KNOWN_PLACEHOLDERS = [
  // Customer
  'customer_name',
  'consumer_number',
  'customer_address',
  'mobile_number',
  'email',
  'aadhaar_number',
  // Project
  'project_capacity',
  'project_capacity_display',
  'sanctioned_capacity',
  'sanctioned_capacity_display',
  'installation_date',
  'application_number',
  'application_date',
  'project_model',
  're_arrangement_type',
  // Vendor
  'vendor_name',
  'vendor_address',
  'vendor_phone',
  'vendor_email',
  'vendor_gstin',
  'vendor_owner',
  // Solar
  'module_make',
  'module_model',
  'module_wattage',
  'module_wattage_display',
  'module_quantity',
  'module_total_capacity',
  'module_total_capacity_display',
  'module_efficiency',
  'module_efficiency_display',
  'module_serial_numbers',
  // Inverter
  'inverter_make',
  'inverter_model',
  'inverter_capacity',
  'inverter_capacity_display',
  'inverter_phase',
  'grid_voltage',
  'grid_voltage_display',
  'inverter_ip_rating',
  'manufacturing_year',
  // Technical
  'earthing_count',
  'earth_resistance',
  'earthing_display',
  'power_output_before',
  'power_output_before_display',
  'power_output_after',
  'power_output_after_display',
  'grid_side_voltage',
  'grid_side_voltage_display',
  'inverter_side_voltage',
  'inverter_side_voltage_display',
  // Agreement
  'agreement_date',
  'agreement_cost',
  'agreement_cost_display',
  'maintenance_years',
  'performance_ratio',
  // Extra placeholders present in templates
  'licensee_name',
  'location',
  'registration_fees',
  'observation_date',
  'discom_name',
  'discom_address',
  'licensee_address',
  're_source'
] as const;

function fillMissingContext(context: DocumentContext): DocumentContext {
  const normalized: DocumentContext = {};

  for (const [key, value] of Object.entries(context)) {
    normalized[key] = value == null ? '' : String(value);
  }

  for (const key of KNOWN_PLACEHOLDERS) {
    if (!(key in normalized)) {
      normalized[key] = '';
    }
  }

  return normalized;
}

export interface GenerateDocumentsResult {
  generatedFiles: string[];
  failedTemplates: Array<{ template: string; error: string }>;
}

export interface InMemoryDoc {
  name: string;
  buffer: Buffer;
}

export interface InMemoryResult {
  docs: InMemoryDoc[];
  failedTemplates: Array<{ template: string; error: string }>;
}

/** Generates all documents in memory — no filesystem writes. Works on Vercel/serverless. */
export async function generateProjectDocumentsInMemory(
  context: DocumentContext,
  templatesDir: string
): Promise<InMemoryResult> {
  const docs: InMemoryDoc[] = [];
  const failedTemplates: Array<{ template: string; error: string }> = [];
  const safeContext = fillMissingContext(context);

  for (const templateName of TEMPLATE_FILES) {
    const templatePath = path.join(templatesDir, templateName);

    if (!fs.existsSync(templatePath)) {
      failedTemplates.push({ template: templateName, error: 'Template file not found' });
      continue;
    }

    try {
      const content = fs.readFileSync(templatePath, 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '{{', end: '}}' },
        nullGetter() { return ''; },
      });

      doc.render(safeContext);

      // Fallback: replace any remaining {{placeholders}} docxtemplater missed
      const renderedZip = doc.getZip();
      for (const xmlFileName of Object.keys(renderedZip.files)) {
        if (!xmlFileName.endsWith('.xml') && !xmlFileName.endsWith('.rels')) continue;
        const file = renderedZip.files[xmlFileName];
        if (file.dir) continue;
        let xmlContent: string = file.asText();
        let replaced = false;

        // 1. Replace {{placeholders}}
        for (const [key, value] of Object.entries(safeContext)) {
          const tag = `{{${key}}}`;
          if (xmlContent.includes(tag)) {
            const safeValue = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            while (xmlContent.includes(tag)) { xmlContent = xmlContent.replace(tag, safeValue); replaced = true; }
          }
        }

        // 2. Replace Legacy Hardcoded text with Vendor Profile details
        const legacyMappings = [
          { old: 'IMPRESS SOLAR POINT', new: safeContext.vendor_name },
          { old: 'Impress Solar Point', new: safeContext.vendor_name },
          { old: 'PARADISE ENERGIES', new: safeContext.vendor_name },
          { old: '+917744819280', new: safeContext.vendor_phone },
          { old: 'munavvarhussain445@gmail.com', new: safeContext.vendor_email },
          // Two different GSTINs found in templates — both map to vendor_gstin
          { old: '27CLEPS3644D2Z1', new: safeContext.vendor_gstin },
          { old: '27AUEPH3173P1Z8', new: safeContext.vendor_gstin },
          // Vendor addresses — some are split across XML runs so we match each run part
          // Legacy address (single XML run)
          { old: 'IN FRONT OF TAHESIL OFFICE, BARSHITAKLI Dist - AKOLA, Pin Code 444401', new: safeContext.vendor_address },
          // Islanding Certificate: address is split across two XML runs
          { old: 'Building No. 454, Qasadpura, Daryapur Banosa', new: safeContext.vendor_address },
          { old: 'Dist - AKOLA , Pin Code . 44 4401', new: '' },
          // MODEL_AG full address (single XML run)
          { old: 'Building No. 454, Qasadpura, Near New Fashion Tailor, Daryapur Banosa, Dist. Amravati, Maharashtra - 444803', new: safeContext.vendor_address },
          // Owner / signatory
          { old: 'Authorized Signatory', new: safeContext.vendor_owner },
          { old: 'MUNAVVER HUSAIN MUZAFFAR HUSAIN', new: safeContext.vendor_owner },
          // WCR_ISLANDING has a 3rd IMPRESS occurrence split across two XML runs:
          // run1: " IMPRESS" (leading space), run2: " SOLAR POINT" (leading space)
          { old: ' IMPRESS', new: ` ${safeContext.vendor_name}` },
          { old: ' SOLAR POINT', new: '' },
          // DISCOM subdivision (city-specific)
          { old: 'MSEDCL Subdivision Akola', new: safeContext.discom_address || 'MSEDCL Subdivision Akola' },
        ];

        for (const mapping of legacyMappings) {
          if (xmlContent.includes(mapping.old)) {
            const safeValue = String(mapping.new ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            xmlContent = xmlContent.split(mapping.old).join(safeValue);
            replaced = true;
          }
        }

        // Remove hardcoded Aadhaar photo from WCR_ISLANDING (rId8 / ADHAR_ASHFAQ image)
        // Replace the <w:pict> VML image element with a placeholder text paragraph
        if (xmlFileName.endsWith('document.xml') && xmlContent.includes('ADHAR_ASHFAQ')) {
          const pictRegex = /<w:pict(?:(?!<w:pict>).)*ADHAR_ASHFAQ.*?<\/w:pict>/;
          const placeholder = `<w:t>[Aadhaar Card Copy — Attach Here]</w:t>`;
          if (pictRegex.test(xmlContent)) {
            xmlContent = xmlContent.replace(pictRegex, placeholder);
            replaced = true;
          }
        }

        if (replaced) renderedZip.file(xmlFileName, xmlContent);
      }

      // Remove the Aadhaar image file from WCR_ISLANDING zip
      if (templateName === 'WCR_ISLANDING_template.docx') {
        // Remove image binary
        if (renderedZip.files['word/media/image1.jpeg']) {
          delete renderedZip.files['word/media/image1.jpeg'];
        }
        // Remove rId8 from relationships
        const relsKey = Object.keys(renderedZip.files).find(f => f.replace(/\\/g, '/') === 'word/_rels/document.xml.rels');
        if (relsKey) {
          let relsXml = renderedZip.files[relsKey].asText();
          relsXml = relsXml.replace(/<Relationship[^>]*Id="rId8"[^>]*\/>/, '');
          renderedZip.file(relsKey, relsXml);
        }
      }

      const buf = renderedZip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
      const outputFileName = templateName.replace(
        '_template',
        `_${safeContext.customer_name.replace(/\s+/g, '_')}`
      );
      docs.push({ name: outputFileName, buffer: buf });
    } catch (error: any) {
      failedTemplates.push({ template: templateName, error: error?.message || 'Unknown error' });
    }
  }

  return { docs, failedTemplates };
}

export async function generateProjectDocuments(
  context: DocumentContext, 
  templatesDir: string, 
  outputDir: string
): Promise<GenerateDocumentsResult> {
  const generatedFiles: string[] = [];
  const failedTemplates: Array<{ template: string; error: string }> = [];
  const safeContext = fillMissingContext(context);
  
  // Create output dir specific to this customer/project
  const projectFolder = path.join(
    outputDir,
    `${safeContext.consumer_number}_${safeContext.customer_name.replace(/\s+/g, '_')}`
  );
  if (!fs.existsSync(projectFolder)) {
    fs.mkdirSync(projectFolder, { recursive: true });
  }

  for (const templateName of TEMPLATE_FILES) {
    const templatePath = path.join(templatesDir, templateName);
    
    if (!fs.existsSync(templatePath)) {
      console.warn(`Template missing: ${templatePath}`);
      failedTemplates.push({
        template: templateName,
        error: 'Template file not found'
      });
      continue;
    }

    try {
      const content = fs.readFileSync(templatePath, 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '{{', end: '}}' },
        nullGetter() {
          return '';
        }
      });

      doc.render(safeContext);

      // --- Fallback: raw XML string-replace for any {{placeholder}} that
      // docxtemplater silently skipped (e.g. due to complex XML structure).
      const renderedZip = doc.getZip();
      for (const xmlFileName of Object.keys(renderedZip.files)) {
        if (!xmlFileName.endsWith('.xml') && !xmlFileName.endsWith('.rels')) continue;
        const file = renderedZip.files[xmlFileName];
        if (file.dir) continue;
        let xmlContent: string = file.asText();
        let replaced = false;

        // 1. Replace {{placeholders}}
        for (const [key, value] of Object.entries(safeContext)) {
          const tag = `{{${key}}}`;
          if (xmlContent.includes(tag)) {
            // Escape special XML chars in replacement value
            const safeValue = String(value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
            while (xmlContent.includes(tag)) {
              xmlContent = xmlContent.replace(tag, safeValue);
              replaced = true;
            }
          }
        }

        // 2. Replace Legacy Hardcoded text with Vendor Profile details
        const legacyMappings = [
          { old: 'IMPRESS SOLAR POINT', new: safeContext.vendor_name },
          { old: 'Impress Solar Point', new: safeContext.vendor_name },
          { old: 'PARADISE ENERGIES', new: safeContext.vendor_name },
          { old: '+917744819280', new: safeContext.vendor_phone },
          { old: 'munavvarhussain445@gmail.com', new: safeContext.vendor_email },
          // Two different GSTINs found in templates — both map to vendor_gstin
          { old: '27CLEPS3644D2Z1', new: safeContext.vendor_gstin },
          { old: '27AUEPH3173P1Z8', new: safeContext.vendor_gstin },
          // Vendor addresses — some are split across XML runs so we match each run part
          // Legacy address (single XML run)
          { old: 'IN FRONT OF TAHESIL OFFICE, BARSHITAKLI Dist - AKOLA, Pin Code 444401', new: safeContext.vendor_address },
          // Islanding Certificate: address is split across two XML runs
          { old: 'Building No. 454, Qasadpura, Daryapur Banosa', new: safeContext.vendor_address },
          { old: 'Dist - AKOLA , Pin Code . 44 4401', new: '' },
          // MODEL_AG full address (single XML run)
          { old: 'Building No. 454, Qasadpura, Near New Fashion Tailor, Daryapur Banosa, Dist. Amravati, Maharashtra - 444803', new: safeContext.vendor_address },
          // Owner / signatory
          { old: 'Authorized Signatory', new: safeContext.vendor_owner },
          { old: 'MUNAVVER HUSAIN MUZAFFAR HUSAIN', new: safeContext.vendor_owner },
          // WCR_ISLANDING has a 3rd IMPRESS occurrence split across two XML runs:
          // run1: " IMPRESS" (leading space), run2: " SOLAR POINT" (leading space)
          { old: ' IMPRESS', new: ` ${safeContext.vendor_name}` },
          { old: ' SOLAR POINT', new: '' },
          // DISCOM subdivision (city-specific)
          { old: 'MSEDCL Subdivision Akola', new: safeContext.discom_address || 'MSEDCL Subdivision Akola' },
        ];

        for (const mapping of legacyMappings) {
          if (xmlContent.includes(mapping.old)) {
            const safeValue = String(mapping.new ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            xmlContent = xmlContent.split(mapping.old).join(safeValue);
            replaced = true;
          }
        }

        // Remove hardcoded Aadhaar photo from WCR_ISLANDING (rId8 / ADHAR_ASHFAQ image)
        // Replace the <w:pict> VML image element with a placeholder text paragraph
        if (xmlFileName.endsWith('document.xml') && xmlContent.includes('ADHAR_ASHFAQ')) {
          const pictRegex = /<w:pict(?:(?!<w:pict>).)*ADHAR_ASHFAQ.*?<\/w:pict>/;
          const placeholder = `<w:t>[Aadhaar Card Copy — Attach Here]</w:t>`;
          if (pictRegex.test(xmlContent)) {
            xmlContent = xmlContent.replace(pictRegex, placeholder);
            replaced = true;
          }
        }

        if (replaced) {
          renderedZip.file(xmlFileName, xmlContent);
        }
      }

      // Remove the Aadhaar image file from WCR_ISLANDING zip
      if (templateName === 'WCR_ISLANDING_template.docx') {
        if (renderedZip.files['word/media/image1.jpeg']) {
          delete renderedZip.files['word/media/image1.jpeg'];
        }
        const relsKey = Object.keys(renderedZip.files).find(f => f.replace(/\\/g, '/') === 'word/_rels/document.xml.rels');
        if (relsKey) {
          let relsXml = renderedZip.files[relsKey].asText();
          relsXml = relsXml.replace(/<Relationship[^>]*Id="rId8"[^>]*\/>/, '');
          renderedZip.file(relsKey, relsXml);
        }
      }

      const buf = renderedZip.generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
      });

      // Save DOCX
      const outputFileName = templateName.replace(
        '_template',
        `_${safeContext.customer_name.replace(/\s+/g, '_')}`
      );
      const outputPath = path.join(projectFolder, outputFileName);
      fs.writeFileSync(outputPath, buf);
      generatedFiles.push(outputPath);

      // PDF Conversion (Requires LibreOffice installed on the server)
      // convertToPdf(outputPath, projectFolder);

    } catch (error: any) {
      const message = error?.message || 'Unknown generation error';
      failedTemplates.push({
        template: templateName,
        error: message
      });
      console.error(`Error generating document ${templateName}:`, error);
    }
  }

  return {
    generatedFiles,
    failedTemplates
  };
}

/**
 * Converts DOCX to PDF using LibreOffice headless mode.
 * Note: LibreOffice must be installed on your backend/docker container.
 */
export function convertToPdf(inputPath: string, outputDir: string) {
    const { execSync } = require('child_process');
    try {
        console.log(`Converting ${inputPath} to PDF...`);
        execSync(`soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`);
    } catch (e) {
        console.error("PDF conversion failed. Is LibreOffice installed?", e);
    }
}
