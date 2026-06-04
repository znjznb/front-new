/**
 * Sync all base products to CMS-managed JSON files in src/cms-products/
 *
 * Populates every field from src/data/products.json into individual CMS files,
 * so the Decap CMS editor shows complete product data.
 *
 * Run: node scripts/sync-cms-products.mjs
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productsPath = resolve(__dirname, '../src/data/products.json');
const cmsDir = resolve(__dirname, '../src/cms-products/');

const products = JSON.parse(readFileSync(productsPath, 'utf-8'));
const baseProducts = products.filter(p => p.line && p.line !== 'None');

// Existing CMS files indexed by product name
const existingFiles = readdirSync(cmsDir).filter(f => f.endsWith('.json'));
const existingByName = new Map();
for (const f of existingFiles) {
  try {
    const data = JSON.parse(readFileSync(resolve(cmsDir, f), 'utf-8'));
    if (data.name) existingByName.set(data.name, f);
  } catch { /* skip unparseable */ }
}

console.log(`Base products: ${baseProducts.length}`);
console.log(`Existing CMS files: ${existingFiles.length} (${existingByName.size} with valid names)`);

// All CMS widget fields (in order of appearance in the admin form)
const CMS_FIELDS = [
  'name', 'nickname', 'desc', 'line', 'types', 'status',
  'image', 'images',
  'skin_type', 'audience', 'efficacy',
  'skus', 'ingredients',
  'can_claim', 'detail_description',
  'buy_url', 'order',
];

// Internal line → CMS display line mapping
const LINE_TO_DISPLAY = {
  '专业线': '专业线｜Expert Collection',
  '女性线-干敏肌': '女性线｜Féminine Collection',
  '女性线-油敏肌': '女性线｜Féminine Collection',
  '婴童线': '婴童线｜Primal Comfort',
};

// Infer a slug from product name (same logic as src/data/products.js)
function productToSlug(name) {
  return name
    .replace(/[（(]/g, '-')
    .replace(/[）)]/g, '')
    .replace(/[·・\/\s\[\]"]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

// Build a CMS-compatible data object from a base product
function buildCmsData(p) {
  const data = {};

  for (const field of CMS_FIELDS) {
    const val = p[field];
    if (val === undefined || val === null || val === '' || val === 'None') {
      continue;  // skip empty — CMS will use its default
    }

    switch (field) {
      case 'line':
        // Store display format for CMS dropdown
        data.line = LINE_TO_DISPLAY[val] || val;
        break;

      case 'efficacy':
        // Base stores as comma-separated string; CMS expects a list
        data.efficacy = typeof val === 'string'
          ? val.split(',').map(s => s.trim()).filter(Boolean)
          : val;
        break;

      case 'types':
        // Pass through as-is (already an array)
        data.types = Array.isArray(val) ? val : [val];
        break;

      case 'images':
        // Ensure array
        data.images = Array.isArray(val) ? val : (val ? [val] : []);
        break;

      case 'skus':
        // Pass through as-is (array of objects or empty)
        data.skus = Array.isArray(val) ? val : [];
        break;

      case 'ingredients':
        // Keep as raw string; CMS list widget converts on save
        data.ingredients = val;
        break;

      default:
        data[field] = val;
    }
  }

  // Include base `description` as CMS `desc` (internal note)
  if (!data.desc && p.description && p.description !== 'None') {
    data.desc = p.description;
  }

  // Ensure name is always present (merge key)
  data.name = p.name;

  return data;
}

let created = 0;
let updated = 0;
for (const p of baseProducts) {
  const slug = productToSlug(p.name);
  const filePath = resolve(cmsDir, `${slug}.json`);
  const cmsData = buildCmsData(p);

  const existingFile = existingByName.get(p.name);
  if (existingFile) {
    // Read existing, merge: keep any manually-set CMS values, fill missing from base
    const existingPath = resolve(cmsDir, existingFile);
    const existing = JSON.parse(readFileSync(existingPath, 'utf-8'));

    // Merge: existing values take priority over base (user may have edited in CMS)
    const merged = { ...cmsData, ...existing };
    // But always keep the fresh `line` display mapping (CMS dropdown values)
    if (p.line) merged.line = LINE_TO_DISPLAY[p.line] || p.line;
    writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n');
    updated++;
    console.log(`  ~ ${p.name} — updated`);
  } else {
    // New file
    writeFileSync(filePath, JSON.stringify(cmsData, null, 2) + '\n');
    created++;
    console.log(`  + ${p.name} — created`);
  }
}

console.log(`\nDone. Created: ${created}, Updated: ${updated}. Total: ${existingFiles.length + created}`);
