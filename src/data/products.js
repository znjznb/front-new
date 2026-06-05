import products from './products.json' with { type: 'json' };

// Merge CMS-managed overrides from src/cms-products/
const cmsOverrides = Object.values(
  import.meta.glob('/src/cms-products/*.json', { eager: true, import: 'default' })
);

export function getAllProducts() {
  // Map CMS display-format line names to internal keys
  function cmsLineToInternal(displayLine) {
    if (!displayLine) return null;
    const map = {
      '专业线｜Expert Collection': '专业线',
      '婴童线｜Primal Comfort': '婴童线',
      '女性线｜Féminine Collection': '女性线-干敏肌',
      '医用敷料｜Biocellulaire Therapy': '专业线',
    };
    return map[displayLine] || displayLine;
  }

  // Start with all base products that have a valid line
  const merged = products
    .filter(p => p.line && p.line !== 'None')
    .map(p => {
      const override = cmsOverrides.find(o => o.name === p.name);
      if (!override) return p;
      // Merge CMS override fields, but exclude `line` (CMS uses display format, not internal key)
      const { line: _line, ...safeOverride } = override;
      return { ...p, ...safeOverride };
    });

  // Also include CMS-only products (created via Decap CMS, not in products.json)
  const baseNames = new Set(products.map(p => p.name));
  for (const cms of cmsOverrides) {
    if (baseNames.has(cms.name)) continue;
    const { line: _line, ...safeCms } = cms;
    merged.push({
      name: cms.name || '未命名商品',
      line: cmsLineToInternal(cms.line) || '专业线',
      nickname: cms.nickname || cms.desc || '',
      description: '',
      direction: 'None',
      skin_type: 'None',
      audience: 'None',
      efficacy: 'None',
      status: '已上市',
      ingredients: '',
      can_claim: '',
      order: 99,
      image: cms.image || '',
      images: cms.images || [],
      skus: cms.skus || [],
      types: cms.types || [],
      buy_url: cms.buy_url || '',
      ...safeCms,
    });
  }

  // Sort by order field ascending; products without order stay at the end
  merged.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return merged;
}

export function getProductsByLine(line) {
  return getAllProducts().filter(p => p.line === line);
}

export function getProductsBySkinType(skinType) {
  return getAllProducts().filter(p =>
    p.skin_type.toLowerCase().includes(skinType.toLowerCase())
  );
}

export function getProductsByDirection(direction) {
  return getAllProducts().filter(p => p.direction === direction);
}

export function getProductsByStatus(status) {
  return getAllProducts().filter(p => p.status === status);
}

// ── Product primary images (white-bg product photos v2) ──
const PRODUCT_PRIMARY_IMAGES = {
  '大白管特护霜（倍润版）': '/assets/products/大白管特护霜（倍润版）150g.png',
  '大白管特护霜（清爽版）': '/assets/products/大白管特护霜（清爽版）150g.png',
  '干敏沐浴露': '/assets/products/干敏沐浴露400ml.png',
  '唇敏修护唇膏': '/assets/products/唇敏修护唇膏8g.png',
  '可拉伸湿包裹棉': '/assets/products/可拉伸湿包裹棉.png',
  '膏状敷料': '/assets/products/膏状敷料.png',
  '护理软膏': '/assets/products/护理软膏.png',
  '水凝胶敷料': '/assets/products/水凝胶敷料25g.png',
  '全域速修精华油': '/assets/products/全域速修精华油50ml.png',
  '敏肌护理旅行套装': '/assets/products/敏肌护理旅行套装.png',
  '速修全域贴': '/assets/products/速修全域贴.png',
  // New v2 mappings
  '五阶面霜': '/assets/products/五阶面霜.png',
  '全域修护霜（控油版）': '/assets/products/全域修护霜（控油版）.png',
  '全域修护霜（滋润版）': '/assets/products/全域修护霜（滋润版）.png',
  '全域修护霜（轻润版）': '/assets/products/全域修护霜（轻润版）50g.png',
  '全域速修精华液': '/assets/products/全域速修精华液.png',
  '唇敏灰绷带': '/assets/products/唇敏灰绷带.png',
  '干敏抗初老霜': '/assets/products/干敏抗初老霜.png',
  '干敏洁面慕斯': '/assets/products/干敏洁面慕斯.png',
  '控油哑光水': '/assets/products/控油哑光水.png',
  '金银花爽身露': '/assets/products/金银花爽身露.png',
  '晒后修护凝胶': '/assets/products/晒后修护凝胶.png',
  // CMS product names
  '大白管特护霜': '/assets/products/大白管特护霜（倍润版）150g.png',
  '贻贝止痒膏': '/assets/products/贻贝止痒膏-放绳-棕.png',
};

// ── SKU variants (same product, different capacity/color) ──
const PRODUCT_SKU_VARIANTS = {
  '大白管特护霜（倍润版）': [
    { label: '150g', image: '/assets/products/大白管特护霜（倍润版）150g.png', default: true, status: '在售' },
    { label: '350g', image: '/assets/products/大白管特护霜（倍润版）350g.png', status: '在售' },
  ],
  '大白管特护霜（清爽版）': [
    { label: '150g', image: '/assets/products/大白管特护霜（清爽版）150g.png', default: true, status: '即将更换包装' },
    { label: '350g', image: '/assets/products/大白管特护霜（清爽版）350g.png', status: '即将更换包装' },
  ],
  '大白管特护霜': [
    { label: '倍润·150g', image: '/assets/products/大白管特护霜（倍润版）150g.png', default: true, status: '在售' },
    { label: '倍润·350g', image: '/assets/products/大白管特护霜（倍润版）350g.png', status: '在售' },
    { label: '清爽·150g', image: '/assets/products/大白管特护霜（清爽版）150g.png', status: '即将更换包装' },
    { label: '清爽·350g', image: '/assets/products/大白管特护霜（清爽版）350g.png', status: '即将更换包装' },
  ],
  '唇敏修护唇膏': [
    { label: '8g', image: '/assets/products/唇敏修护唇膏8g.png', default: true, status: '在售' },
    { label: '12g', image: '/assets/products/唇敏修护唇膏12g.png', status: '在售' },
  ],
  '水凝胶敷料': [
    { label: '25g', image: '/assets/products/水凝胶敷料25g.png', default: true, status: '在售' },
    { label: '80g', image: '/assets/products/水凝胶敷料80g.png', status: '在售' },
  ],
  '全域修护霜（轻润版）': [
    { label: '50g', image: '/assets/products/全域修护霜（轻润版）50g.png', default: true, status: '在售' },
    { label: '5g', image: '/assets/products/全域修护霜（轻润版）5g.png', status: '即将上市' },
  ],
  '贻贝止痒膏': [
    { label: '沙焙棕', image: '/assets/products/贻贝止痒膏-放绳-棕.png', default: true, status: '在售' },
    { label: '贝帐紫', image: '/assets/products/贻贝止痒膏-放绳-粉.png', status: '在售' },
    { label: '礁衣绿', image: '/assets/products/贻贝止痒膏-放绳-绿.png', status: '在售' },
    { label: '鲸眠蓝', image: '/assets/products/贻贝止痒膏-放绳-蓝.png', status: '在售' },
    { label: '珊瑚黄', image: '/assets/products/贻贝止痒膏-放绳-黄.png', status: '在售' },
  ],
};

export function getProductSkus(product) {
  // CMS-managed SKU data takes priority
  if (product.skus && Array.isArray(product.skus) && product.skus.length > 0) {
    return product.skus;
  }
  // Fallback to hardcoded mapping
  return PRODUCT_SKU_VARIANTS[product.name] || null;
}

export function hasSkus(product) {
  return product.name in PRODUCT_SKU_VARIANTS;
}

export function getProductImage(product) {
  // Per-product image field in data takes priority
  if (product.image) return product.image;
  // White-background product photo mapping
  if (PRODUCT_PRIMARY_IMAGES[product.name]) return PRODUCT_PRIMARY_IMAGES[product.name];
  // Fallback to line-level image
  return getLineImage(product.line);
}

export function getLineImage(line) {
  const map = {
    '专业线': '/assets/product-professional.png',
    '女性线-干敏肌': '/assets/product-women.jpg',
    '女性线-油敏肌': '/assets/product-women.jpg',
    '婴童线': '/assets/product-kids.jpg',
  };
  return map[line] || '/assets/product-cream.jpg';
}

export function getLineDisplayName(line) {
  const map = {
    '专业线': '专业线',
    '女性线-干敏肌': '女性线·干敏肌',
    '女性线-油敏肌': '女性线·油敏肌',
    '婴童线': '婴童线',
  };
  return map[line] || line;
}

export function getLineEnName(line) {
  const map = {
    '专业线': 'Expert Collection',
    '女性线-干敏肌': 'Féminine · Dry Sensitive',
    '女性线-油敏肌': 'Féminine · Oily Sensitive',
    '婴童线': 'Primal Comfort',
  };
  return map[line] || line;
}

export function getLineDescription(line) {
  const map = {
    '专业线': '经全国1000+公立医院皮肤科临床验证的专业护肤方案，以CAPCS®凯普斯泰为核心成分，从根源舒缓敏感、修护皮肤屏障。',
    '女性线-干敏肌': '专为干性敏感肌设计的温和抗老与修护方案，融合CAPCS®专利成分与多重神经酰胺，在舒缓敏感的同时实现嘭弹水润。',
    '女性线-油敏肌': '针对油性痘敏肌的控油修护系列，平衡微生态的同时舒缓泛红，让油敏肌也能享受温和有效的护理体验。',
    '婴童线': '专为婴幼儿娇嫩肌肤打造的温和护理系列，极简配方、入口无毒，从新生儿到儿童都能安心使用。',
  };
  return map[line] || '';
}

// ── 产品类型分类 ──
// Fallback heuristic when `types` field is not set in data
function inferProductType(product) {
  const name = product.name;
  if (name.includes('唇')) return '唇部护理';
  if (product.direction === '医疗向') return '院线同款';
  if (name.includes('洁面') || name.includes('慕斯') || name.includes('爽身露') ||
      name === '控油哑光水' || name === '可拉伸湿敷棉') return '水/洁面';
  if (name.includes('沐浴露') || name.includes('精华油') || name.includes('旅行套装'))
    return '身体护理';
  if (name.includes('湿包裹') || name.includes('敷料') || name.includes('软膏'))
    return '院线同款';
  return '精华/面霜';
}

export function getProductTypes(product) {
  // Data-driven: use `types` array from products.json or CMS override
  if (product.types && Array.isArray(product.types) && product.types.length > 0) {
    return product.types;
  }
  // Fallback: heuristic by product name
  return [inferProductType(product)];
}

export function getProductType(product) {
  return getProductTypes(product)[0];
}

export const PRODUCT_TYPES = ['精华/面霜', '水/洁面', '身体护理', '唇部护理', '院线同款'];

export function getProductsByType(type) {
  return getAllProducts().filter(p => getProductTypes(p).includes(type));
}

export function getTypeSlug(type) {
  const map = {
    '精华/面霜': 'essence-cream',
    '水/洁面': 'toner-cleanser',
    '身体护理': 'body-care',
    '唇部护理': 'lip-care',
    '院线同款': 'medical-pro',
  };
  return map[type] || type;
}

export function getTypeFromSlug(slug) {
  const map = {
    'essence-cream': '精华/面霜',
    'toner-cleanser': '水/洁面',
    'body-care': '身体护理',
    'lip-care': '唇部护理',
    'medical-pro': '院线同款',
  };
  return map[slug] || null;
}

export function getTypeImage(type) {
  const map = {
    '精华/面霜': '/assets/product-cream.jpg',
    '水/洁面': '/assets/product-freshlotion.jpg',
    '身体护理': '/assets/product-bodylotion.jpg',
    '唇部护理': '/assets/product-lipbalm.jpg',
    '院线同款': '/assets/product-medical.jpg',
  };
  return map[type] || '/assets/product-cream.jpg';
}

export function getTypeDescription(type) {
  const map = {
    '精华/面霜': '从特护霜到精华液，覆盖各类面霜与精华产品，以CAPCS®凯普斯泰为核心，深层修护敏感肌屏障。',
    '水/洁面': '温和清洁、舒缓爽肤，专为敏感肌设计的洁面与爽肤产品，洗后不紧绷，呵护脆弱皮脂膜。',
    '身体护理': '从头到脚的全身护理方案，蕴含CAPCS®专利成分与天然植萃，温和舒缓全身肌肤敏感。',
    '唇部护理': '专为敏感唇部设计的修护产品，1分钟舒缓唇部干痒、脱屑，持效修护唇部屏障。',
    '院线同款': '全国1000+公立医院皮肤科临床选用的医用级产品，通过严格医疗器械备案，专业修护问题肌肤。',
  };
  return map[type] || '';
}

export const ALL_LINES = ['专业线', '女性线-干敏肌', '女性线-油敏肌', '婴童线'];

export function getFeminineProducts() {
  return [
    ...getProductsByLine('女性线-干敏肌'),
    ...getProductsByLine('女性线-油敏肌'),
  ];
}

export function getMedicalProducts() {
  return getProductsByDirection('医疗向');
}

// ── Product images for detail page gallery ──
function normalizeImages(images) {
  // CMS list+string: ["/a.jpg", "/b.jpg"] → as-is
  // CMS list+file:  [{src:"/a.jpg"}, {image:"/b.jpg"}] → extract first value
  return images.map(item =>
    typeof item === 'string' ? item : (item.src || item.image || Object.values(item)[0])
  );
}

export function getProductImages(product) {
  // Per-product images set in products.json or CMS take priority
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return normalizeImages(product.images);
  }

  // Fallback: only real product images, no generic placeholders
  return [getProductImage(product)];
}

// ── Product buy URL (configurable via products.json buy_url field) ──
const DEFAULT_BUY_URL = 'https://detail.tmall.com/item.htm?abbucket=8&id=642248695784&pisk=g0rr4lXDmDVjU11gQRmF7mJI6Um-kD5_ZkGIKJ2nFbcuAaIEL5NCebwWPrk3GWoIAJf8Tkl0pz6-R_pUu7eiPWydevc3tWlQPZs_e8nKx1wFfGw-1NVC_7kntEXnQAvlh42IE1YEx111YE9my_i3d_um2SYmBjDkqb0l3xDndDDnZYXqivktt3VnxtWqKvxkxYcoiqDZBDYnt20mnYH6EUxkxxXqpjxkqWmh3mcxKDc3tDc6J23J9A0lFpUKSBWdNsG_Ej-HxujKzfuJRHtQtY0rEVGqlqZqU4liRxwEwlygElHUvOYETJauNxFFbso047rouDSeD0wao7u4z6-qkr2TxqzA_FeTE7ziSujVEWP0BPnuq6KSwy20xjZldHlg5RnqHk1vqXz0-ug-vQfr3uyaYySyZBHmf5ZLzBYErxHq1tW45WtbEghOi7TpJqVm3f6-7eLKrqkq1tW2Je3JDxl1eV5..&rn=5fd28ba0ad915f6672caa21745b901e4&spm=a1z10.3-b-s.w4011-24941648742.94.bd291902QlKOhk';

export function getProductBuyUrl(product) {
  return product.buy_url || DEFAULT_BUY_URL;
}

// ── Product slug helpers for detail pages ──
export function getProductSlug(product) {
  return product.name
    .replace(/[（(]/g, '-')
    .replace(/[）)]/g, '')
    .replace(/[·・]/g, '-')
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[[\]"]/g, '')
    .replace(/^-|-$/g, '');
}

export function getProductBySlug(slug) {
  return getAllProducts().find(p => getProductSlug(p) === slug) || null;
}

// ── Get line accent color ──
export function getLineAccentColor(line) {
  const map = {
    '专业线': 'oklch(0.70 0.15 218)',
    '女性线-干敏肌': 'oklch(0.70 0.14 166)',
    '女性线-油敏肌': 'oklch(0.70 0.14 166)',
    '婴童线': 'oklch(0.80 0.06 92)',
  };
  return map[line] || 'oklch(0.70 0.15 218)';
}

export function getLineHeroGradient(line) {
  const map = {
    '专业线': 'linear-gradient(135deg, oklch(96% 0.014 218) 0%, oklch(98% 0.007 218) 100%)',
    '女性线-干敏肌': 'linear-gradient(135deg, oklch(96% 0.017 166) 0%, oklch(98% 0.008 166) 100%)',
    '女性线-油敏肌': 'linear-gradient(135deg, oklch(96% 0.017 166) 0%, oklch(98% 0.008 166) 100%)',
    '婴童线': 'linear-gradient(135deg, oklch(96% 0.008 92) 0%, oklch(98% 0.004 92) 100%)',
  };
  return map[line] || 'linear-gradient(135deg, oklch(96% 0.01 185) 0%, oklch(98% 0.005 185) 100%)';
}

export { products };
