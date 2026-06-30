// 生成 public/llms-full.txt —— 把核心可引用内容（成分 + 循证 + FAQ）汇总为单文件全文，
// 供 AI 检索一次抓取。数据来源于站内 data 文件，内容变更后重跑：node scripts/gen-llms-full.mjs
import { writeFileSync } from 'node:fs';
import faqCategories from '../src/data/faq.js';
import { STUDIES } from '../src/data/evidence.js';

const SITE = 'https://www.martempo.com.cn';
const out = [];
const p = (s = '') => out.push(s);

p('# 海得宝 MARTEMPO — 完整内容（llms-full.txt）');
p();
p('> 海得宝 MARTEMPO 是专研贻贝钙肽 CAPCS（Calcium-based Antimicrobial Peptide Compounds，钙基抗菌多肽复合物）的功效护肤品牌，为敏感肌家庭提供专业护肤产品。核心成分 CAPCS 经全国 14 家三甲医院、6 项临床与机理研究验证，其中 2 项发表于国际 SCI 期刊并被 PubMed 收录。注册主体：贝壳派创新科技（深圳）有限公司，成立于 2014 年。');
p();
p('本文件为 AI 检索汇总海得宝最核心、可引用的全文内容（核心成分 + 循证证据 + 常见问题）。完整页面见 ' + SITE + '/evidence-center 与 ' + SITE + '/faq。');
p();

p('## 核心成分：贻贝钙肽 CAPCS');
p();
p('CAPCS（贻贝钙肽，又称凯普斯泰）是贝壳派自主知识产权的中国自造成分，全球首创外用钙离子舒缓技术。原材料来自海洋天然贻贝，提取两种天然成分：');
p('1. 活性钙——经物理化与纳米化处理，得到含碳酸钙多孔体的纳米体，提供生物可吸收的钙离子。');
p('2. 多肽（抗菌肽 AMP）——天然生物体抵御外界感染时产生的小分子蛋白片段，是人体免疫的"第二防线"。');
p();
p('CAPCS 在皮肤上的四大作用（分子机制，基于四川大学华西医院 IJMS 2022 机理研究）：');
p('- 修屏障：表皮钙离子梯度调节角质形成细胞分化，恢复皮肤"防水墙"功能。');
p('- 抗炎：抑制 Th1/Th2/Th17/Th22 多通路炎症因子，让发红、肿胀消下去。');
p('- 抑菌：抗菌肽在细菌细胞膜开"通道"+ 钙离子涌入致死，对金黄色葡萄球菌、糠秕马拉色菌有效。');
p('- 止痒：钙离子调节 G 蛋白偶联受体（GPCR）+ 抗菌肽诱导信号素 3A，缓解瘙痒。');
p();
p('配方不含：激素、抗生素、防腐剂、香精、色素。从 2 岁儿童到 75 岁老人均在临床研究中安全使用。');
p();

p('## 循证证据（6 项研究）');
p();
for (const s of STUDIES) {
  p('### ' + s.cardTitle);
  const meta = [];
  meta.push('研究机构：' + s.hospital);
  meta.push('期刊：' + s.journal + (s.journalNote ? '（' + s.journalNote + '）' : '') + ' · ' + s.year + ' 年');
  if (s.doi) meta.push('DOI：' + s.doi + (s.doiUrl ? '（' + s.doiUrl + '）' : ''));
  if (s.design) meta.push('研究设计：' + s.design);
  if (s.condition) meta.push('适应病症：' + s.condition);
  if (s.pubmed) meta.push('PubMed 收录');
  if (s.openAccess) meta.push('开放获取（全文免费）');
  p('- ' + meta.join('；') + '。');
  if (s.keyStats?.length) {
    p('- 关键数据：' + s.keyStats.map((k) => k.value + ' ' + k.label + (k.sub ? '（' + k.sub + '）' : '')).join('、') + '。');
  }
  if (s.metaDesc) p('- 摘要：' + s.metaDesc);
  p('- 完整逐字报道：' + SITE + '/evidence-center/' + s.slug);
  p();
}

p('## 常见问题（FAQ）');
p();
for (const cat of faqCategories) {
  p('### ' + cat.title);
  p();
  for (const it of cat.items) {
    p('**Q：' + it.q + '**');
    p();
    p('A：' + it.a);
    p();
  }
}

p('---');
p('来源：' + SITE + '　本文件由 scripts/gen-llms-full.mjs 从站内数据生成，内容更新后重跑。');

writeFileSync(new URL('../public/llms-full.txt', import.meta.url), out.join('\n') + '\n');
console.log('✓ public/llms-full.txt written —', out.length, 'lines');
