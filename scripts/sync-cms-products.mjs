import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const productsPath = resolve(__dirname, '../src/data/products.json');
const cmsDir = resolve(__dirname, '../src/content/products/');

const products = JSON.parse(readFileSync(productsPath, 'utf-8'));
const baseProducts = products.filter(p => p.line && p.line !== 'None');

// Existing CMS files (by name, not filename — read file content to get the name)
const existingFiles = readdirSync(cmsDir).filter(f => f.endsWith('.json'));
const existingNames = new Set(
  existingFiles.map(f => {
    try {
      const data = JSON.parse(readFileSync(resolve(cmsDir, f), 'utf-8'));
      return data.name;
    } catch { return null; }
  }).filter(Boolean)
);

console.log(`Base products: ${baseProducts.length}`);
console.log(`Existing CMS files: ${existingFiles.length} (${existingNames.size} with valid names)`);

// Map base product fields to CMS-friendly format
function toCmsSlug(name) {
  return name
    .replace(/[（(]/g, '-')
    .replace(/[）)]/g, '')
    .replace(/[·・\/\s\[\]"]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

// Fields the CMS expects
const CMS_FIELDS = ['name', 'nickname', 'desc', 'line', 'types', 'status', 'image', 'images',
  'skin_type', 'audience', 'efficacy', 'skus', 'ingredients', 'can_claim',
  'detail_description', 'buy_url', 'order'];

let created = 0;
for (const p of baseProducts) {
  if (existingNames.has(p.name)) {
    console.log(`  ✓ ${p.name} — already exists`);
    continue;
  }

  // Construct a CMS-compatible JSON file
  const cmsData = {};

  // Fields with direct mapping
  for (const field of CMS_FIELDS) {
    if (p[field] !== undefined && p[field] !== null && p[field] !== '' && p[field] !== 'None') {
      if (field === 'efficacy' && typeof p[field] === 'string' && p[field] !== 'None') {
        cmsData[field] = p[field].split(',').map(s => s.trim()).filter(Boolean);
      } else if ((field === 'skin_type' || field === 'audience') && typeof p[field] === 'string' && p[field] !== 'None') {
        cmsData[field] = p[field];
      } else if (field === 'images' && !Array.isArray(p[field])) {
        cmsData[field] = [p[field]];
      } else {
        cmsData[field] = p[field];
      }
    }
  }

  // Map `description` → `desc` (but `desc` is for internal notes, so only copy if meaningful)
  if (p.description && p.description !== '' && p.description !== 'None' && !cmsData.desc) {
    cmsData.desc = p.description;
  }

  // If no `types`, let CMS auto-infer
  // If no `image` path, skip (CMS can set later)

  const slug = toCmsSlug(p.name);
  const filePath = resolve(cmsDir, `${slug}.json`);
  writeFileSync(filePath, JSON.stringify(cmsData, null, 2) + '\n');
  console.log(`  + ${p.name} → ${slug}.json`);
  created++;
}

console.log(`\nDone. Created ${created} new CMS files. Total CMS files: ${existingFiles.length + created}`);
