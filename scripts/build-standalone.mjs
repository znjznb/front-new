import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC = resolve(ROOT, 'public');
const OUT = resolve(ROOT, 'haidebao-standalone');

const imgToBase64 = (path) => {
  const ext = path.split('.').pop().toLowerCase();
  const mime = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', ico: 'image/x-icon', webp: 'image/webp' }[ext] || 'application/octet-stream';
  return `data:${mime};base64,${readFileSync(resolve(PUBLIC, path)).toString('base64')}`;
};

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const imgNames = [
  'assets/logo-brand.png','assets/logo.png','assets/lifestyle-mother.jpg',
  'assets/ingredient-honeysuckle.jpg','assets/product-medical.jpg','assets/scene-flatlay.jpg',
  'assets/product-professional.png','assets/product-lotion.jpg','assets/product-cream.jpg',
  'assets/product-kids.jpg','assets/product-lipbalm.jpg','assets/product-women.jpg',
];
const imgs = {};
for (const n of imgNames) imgs[n] = imgToBase64(n);

if (!existsSync(resolve(OUT, 'assets'))) mkdirSync(resolve(OUT, 'assets'), { recursive: true });
copyFileSync(resolve(PUBLIC, 'assets/brand-video.mp4'), resolve(OUT, 'assets/brand-video.mp4'));

// Helper to generate product cards
const products = [
  { name:'大白管特护霜', line:'专业线 · Expert Collection', desc:'清爽 / 倍润，适用于干敏肌和受损肌的日常修护', img:'assets/product-professional.png' },
  { name:'全能修护霜', line:'专业线 · Expert Collection', desc:'轻润 / 滋润双版本，全身可用，适合日常维稳', img:'assets/product-cream.jpg' },
  { name:'五阶面霜', line:'婴童线 · Prima Comfort', desc:'分阶呵护 0-3 岁宝宝娇嫩肌肤，从新生儿到学步期', img:'assets/product-kids.jpg' },
  { name:'唇敏灰绷带', line:'奢护线 · Green Diamond Elixir', desc:'唇炎修护，日夜双效，温和包裹敏感双唇', img:'assets/product-lipbalm.jpg' },
  { name:'20X 唇敏修护唇膏', line:'特殊护理', desc:'高浓度 CAPCS®，快速舒缓唇部干痒红痛', img:'assets/product-women.jpg' },
];
const delays = ['reveal-delay-1','reveal-delay-2','reveal-delay-3','reveal-delay-4'];
const productCards = products.map((p,i) =>
  `<article class="product-card reveal ${delays[i%4]}">
    <div class="product-visual"><img class="product-visual-img" src="${imgs[p.img]}" alt="${p.name}" width="800" height="600" loading="lazy"></div>
    <div class="product-info"><h3 class="product-name">${p.name}</h3><p class="product-line">${p.line}</p><p class="product-desc">${p.desc}</p></div>
  </article>`
).join('\n      ');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>海得宝 MarTempo — 敏感肌家庭的专业护理品牌</title>
<meta name="description" content="深海珍宝，以自研CAPCS®凯普斯泰实现天然无激素止痒。全国1000+公立医院皮肤科临床验证。">
<meta name="theme-color" content="#FAF6EE">
<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@200;300;400;500;600;700&display=swap');
:root {
  --color-brand: oklch(70% 0.18 185); --color-brand-soft: oklch(75% 0.12 185);
  --color-brand-dark: oklch(55% 0.15 185); --color-brand-subtle: oklch(90% 0.06 185);
  --color-bg: oklch(96% 0.008 85); --color-bg-alt: oklch(94% 0.01 85);
  --color-surface: oklch(99% 0.003 85); --color-surface-alt: oklch(97% 0.005 85);
  --color-text: oklch(15% 0.01 260); --color-text-soft: oklch(35% 0.015 260);
  --color-text-muted: oklch(55% 0.01 260); --color-text-inverse: oklch(95% 0.005 85);
  --color-border: oklch(88% 0.008 85); --color-border-light: oklch(92% 0.005 85);
  --space-xs: 4px; --space-sm: 8px; --space-md: 16px; --space-lg: 24px; --space-xl: 32px;
  --space-2xl: 48px; --space-3xl: 64px; --space-4xl: 96px; --space-5xl: 128px; --space-6xl: 192px;
  --font-sans: 'Sora', system-ui, -apple-system, sans-serif;
  --text-xs: clamp(.75rem,.7rem+.2vw,.875rem); --text-sm: clamp(.875rem,.8rem+.3vw,1rem);
  --text-base: clamp(1rem,.95rem+.2vw,1.125rem); --text-lg: clamp(1.125rem,1rem+.5vw,1.375rem);
  --text-xl: clamp(1.25rem,1.1rem+.7vw,1.75rem); --text-2xl: clamp(1.5rem,1.2rem+1.2vw,2.25rem);
  --text-3xl: clamp(2rem,1.5rem+2vw,3.25rem); --text-4xl: clamp(2.5rem,1.8rem+3vw,4.5rem);
  --leading-tight: 1.05; --leading-snug: 1.25; --leading-normal: 1.6; --leading-relaxed: 1.8;
  --tracking-tight: -.02em; --tracking-normal: 0; --tracking-wide: .03em; --tracking-wider: .08em; --tracking-widest: .15em;
  --ease-out-expo: cubic-bezier(.16,1,.3,1); --duration-fast: .3s; --duration-medium: .6s; --duration-slow: 1.2s;
  --content-max-width: 1200px; --content-padding: var(--space-lg); --z-nav: 100;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{font-family:var(--font-sans);font-size:var(--text-base);line-height:var(--leading-normal);color:var(--color-text);background:var(--color-bg);overflow-x:hidden}
img{display:block;max-width:100%;height:auto}
a{color:inherit;text-decoration:none}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 28px;font-family:var(--font-sans);font-size:var(--text-sm);font-weight:400;letter-spacing:var(--tracking-wider);text-transform:uppercase;transition:all var(--duration-medium) var(--ease-out-expo);cursor:pointer}
.btn-primary{background:var(--color-text);color:var(--color-text-inverse);border:1px solid var(--color-text)}
.btn-primary:hover{background:transparent;color:var(--color-text)}
.btn-outline{background:transparent;color:var(--color-text);border:1px solid var(--color-text)}
.btn-outline:hover{background:var(--color-text);color:var(--color-text-inverse)}
.section{padding:var(--space-5xl) var(--content-padding);position:relative}
.section-full{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:var(--space-4xl) var(--content-padding);position:relative}
.section-inner{width:100%;max-width:var(--content-max-width);margin:0 auto}
.reveal{opacity:0;transform:translateY(40px);transition:opacity var(--duration-slow) var(--ease-out-expo),transform var(--duration-slow) var(--ease-out-expo)}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.35s}.reveal-delay-4{transition-delay:.5s}
@media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}
.eyebrow{font-size:var(--text-sm);font-weight:600;letter-spacing:var(--tracking-widest);text-transform:uppercase;color:var(--color-brand);margin-bottom:var(--space-md)}
@media(max-width:768px){:root{--content-padding:var(--space-md)}.section{padding:var(--space-4xl) var(--content-padding)}.section-full{padding:var(--space-3xl) var(--content-padding);min-height:80vh}}
.nav{position:fixed;top:0;left:0;right:0;z-index:var(--z-nav);padding:var(--space-lg) var(--content-padding);background:linear-gradient(180deg,oklch(96% .008 85) 60%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.nav-inner{max-width:var(--content-max-width);margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.nav-logo-img{display:block;width:96px;height:auto}
.nav-links{display:flex;gap:var(--space-xl)}
.nav-link{font-size:var(--text-sm);font-weight:400;letter-spacing:var(--tracking-wide);color:var(--color-text-soft);transition:color var(--duration-fast) ease;text-decoration:none;position:relative}
.nav-link::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:1px;background:var(--color-text);transform:scaleX(0);transform-origin:right;transition:transform var(--duration-medium) var(--ease-out-expo)}
.nav-link:hover{color:var(--color-text)}.nav-link:hover::after{transform:scaleX(1);transform-origin:left}
@media(max-width:768px){.nav{padding:var(--space-md)}.nav-links{display:none}}
.hero{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;padding-top:120px}
.hero-bg-video{position:absolute;inset:0;z-index:0}
.hero-video{width:100%;height:100%;object-fit:cover}
.hero-video-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,oklch(0% 0 0/.55),oklch(0% 0 0/.35) 50%,oklch(0% 0 0/.6))}
.hero-content{position:relative;z-index:1;text-align:center;max-width:800px;padding:0 var(--content-padding)}
.hero-logo{margin-bottom:var(--space-xl)}.hero-logo-img{display:block;width:clamp(240px,50vw,520px);height:auto;margin:0 auto}
.hero-subtitle{font-size:var(--text-xl);font-weight:400;letter-spacing:var(--tracking-wide);color:#fff;text-shadow:0 2px 16px rgba(0,0,0,.4);margin-bottom:var(--space-xl)}
.hero-desc{font-size:var(--text-sm);font-weight:400;color:rgba(255,255,255,.85);text-shadow:0 1px 12px rgba(0,0,0,.35);line-height:var(--leading-relaxed);margin-bottom:var(--space-2xl)}
.hero-actions{display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap}
.hero-actions .btn-primary{background:#fff;color:var(--color-text);border-color:#fff}
.hero-actions .btn-primary:hover{background:transparent;color:#fff}
.hero-actions .btn-outline{border-color:rgba(255,255,255,.6);color:rgba(255,255,255,.9)}
.hero-actions .btn-outline:hover{background:#fff;color:var(--color-text);border-color:#fff}
.hero-scroll-hint{position:absolute;bottom:var(--space-2xl);left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:var(--space-sm);opacity:.4;z-index:1}
.hero-scroll-text{font-size:.625rem;letter-spacing:var(--tracking-widest);text-transform:uppercase;color:rgba(255,255,255,.5)}
.hero-scroll-line{width:1px;height:32px;background:rgba(255,255,255,.5);animation:scrollPulse 2s var(--ease-out-expo) infinite}
@keyframes scrollPulse{0%,to{opacity:.3;transform:scaleY(.5)}50%{opacity:1;transform:scaleY(1)}}
@media(max-width:768px){.hero-actions{flex-direction:column;align-items:center}}
.story{background:var(--color-surface);padding-top:var(--space-6xl);padding-bottom:var(--space-6xl)}
.story-bg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 80% at 80% 50%,oklch(90% .06 185/.15),transparent);pointer-events:none}
.story-panel+.story-panel{margin-top:var(--space-5xl);padding-top:var(--space-5xl);border-top:1px solid var(--color-border-light)}
.story-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4xl);align-items:center}
.story-grid-reverse{direction:rtl}.story-grid-reverse>*{direction:ltr}
.story-title{font-size:var(--text-3xl);font-weight:200;line-height:var(--leading-tight);letter-spacing:var(--tracking-wide);margin-bottom:var(--space-xl);color:var(--color-text)}
.story-body{font-size:var(--text-base);font-weight:300;line-height:var(--leading-relaxed);color:var(--color-text-soft);margin-bottom:var(--space-lg);max-width:55ch}
.story-image{width:100%;height:100%;min-height:500px;object-fit:cover;object-position:center}
.story-visual{position:relative;height:100%;min-height:400px;overflow:hidden}
.story-numbers-row{display:flex;justify-content:space-between;gap:var(--space-lg);margin-top:var(--space-5xl);padding:var(--space-2xl);background:oklch(97% .006 185/.5)}
.story-number{text-align:center;flex:1}
.story-number-value{display:block;font-size:var(--text-4xl);font-weight:200;color:var(--color-brand);line-height:var(--leading-tight);margin-bottom:var(--space-sm)}
.story-number-label{font-size:var(--text-sm);font-weight:300;color:var(--color-text-muted)}
@media(max-width:768px){.story-grid{grid-template-columns:1fr;gap:var(--space-2xl)}.story-grid-reverse{direction:ltr}.story-image{min-height:300px}.story-numbers-row{flex-wrap:wrap}}
.science{background:var(--color-bg);padding-top:var(--space-6xl);padding-bottom:var(--space-6xl)}
.science-header{text-align:center;margin-bottom:var(--space-4xl)}
.science-title{font-size:var(--text-3xl);font-weight:200;letter-spacing:var(--tracking-wide);color:var(--color-text);margin-bottom:var(--space-md)}
.science-subtitle{font-size:var(--text-lg);font-weight:300;color:var(--color-text-soft)}
.science-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-lg);margin-bottom:var(--space-4xl)}
.science-card{padding:var(--space-2xl);background:var(--color-surface);border:1px solid var(--color-border-light);transition:all var(--duration-medium) var(--ease-out-expo)}
.science-card:hover{border-color:var(--color-brand-subtle);transform:translateY(-4px)}
.science-card-icon{font-size:1.5rem;margin-bottom:var(--space-lg);color:var(--color-brand)}
.science-card-title{font-size:var(--text-lg);font-weight:500;margin-bottom:var(--space-md);color:var(--color-text)}
.science-card-body{font-size:var(--text-sm);font-weight:300;line-height:var(--leading-relaxed);color:var(--color-text-soft)}
.science-data{display:flex;align-items:center;justify-content:center;gap:var(--space-3xl);padding:var(--space-2xl);background:var(--color-bg-alt)}
.science-data-item{text-align:center}
.science-data-value{display:block;font-size:var(--text-3xl);font-weight:200;color:var(--color-brand-dark);line-height:var(--leading-tight);margin-bottom:var(--space-xs)}
.science-data-label{font-size:var(--text-sm);font-weight:300;color:var(--color-text-muted);max-width:20ch}
.science-data-divider{width:1px;height:48px;background:var(--color-border)}
@media(max-width:768px){.science-grid{grid-template-columns:1fr}.science-data{flex-direction:column;gap:var(--space-xl)}.science-data-divider{width:48px;height:1px}}
.products{background:var(--color-surface);padding-top:var(--space-6xl);padding-bottom:var(--space-6xl)}
.products-header{text-align:center;margin-bottom:var(--space-4xl)}
.products-title{font-size:var(--text-3xl);font-weight:200;letter-spacing:var(--tracking-wide);margin-bottom:var(--space-md)}
.products-subtitle{font-size:var(--text-lg);font-weight:300;color:var(--color-text-soft)}
.products-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-lg)}
.product-card{background:var(--color-bg);overflow:hidden;transition:all var(--duration-medium) var(--ease-out-expo);border:1px solid transparent}
.product-card:hover{border-color:var(--color-border)}
.product-visual{aspect-ratio:4/3;position:relative;overflow:hidden}
.product-visual-img{width:100%;height:100%;object-fit:cover;transition:transform var(--duration-slow) var(--ease-out-expo)}
.product-card:hover .product-visual-img{transform:scale(1.03)}
.product-info{padding:var(--space-lg)}
.product-name{font-size:var(--text-lg);font-weight:500;margin-bottom:var(--space-xs);color:var(--color-text)}
.product-line{font-size:var(--text-xs);font-weight:400;letter-spacing:var(--tracking-wide);color:var(--color-brand);margin-bottom:var(--space-sm)}
.product-desc{font-size:var(--text-sm);font-weight:300;color:var(--color-text-muted)}
@media(max-width:1024px){.products-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.products-grid{grid-template-columns:1fr}}
.trust{background:var(--color-bg);padding-top:var(--space-6xl);padding-bottom:var(--space-6xl);position:relative}
.trust::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--color-brand-subtle),transparent)}
.trust-content{margin-bottom:var(--space-4xl)}
.trust-title{font-size:var(--text-3xl);font-weight:200;letter-spacing:var(--tracking-wide)}
.trust-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-lg);margin-bottom:var(--space-4xl)}
.trust-card{padding:var(--space-2xl);text-align:center;background:var(--color-surface);border:1px solid var(--color-border-light)}
.trust-card-number{display:block;font-size:var(--text-4xl);font-weight:200;color:var(--color-brand-dark);line-height:var(--leading-tight);margin-bottom:var(--space-sm)}
.trust-card-label{font-size:var(--text-sm);font-weight:300;color:var(--color-text-muted)}
.trust-academic{padding:var(--space-2xl);background:var(--color-surface);border:1px solid var(--color-border-light)}
.trust-academic-title{font-size:var(--text-lg);font-weight:500;margin-bottom:var(--space-lg);color:var(--color-text)}
.trust-academic-list{display:flex;flex-direction:column;gap:var(--space-lg)}
.trust-academic-item{padding-bottom:var(--space-lg);border-bottom:1px solid var(--color-border-light)}
.trust-academic-item:last-child{padding-bottom:0;border-bottom:none}
.trust-academic-source{display:block;font-size:var(--text-xs);font-weight:600;letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--color-brand);margin-bottom:var(--space-xs)}
.trust-academic-detail{font-size:var(--text-sm);font-weight:300;line-height:var(--leading-relaxed);color:var(--color-text-soft)}
@media(max-width:768px){.trust-grid{grid-template-columns:1fr}}
.video-section{padding:var(--space-4xl) var(--content-padding);background:var(--color-bg)}
.video-container{max-width:1000px;margin:0 auto}
.video-placeholder{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;cursor:pointer}
.video-placeholder-bg{position:absolute;inset:0;overflow:hidden;transition:transform var(--duration-slow) var(--ease-out-expo)}
.video-container:hover .video-placeholder-bg{transform:scale(1.02)}
.video-placeholder-img{width:100%;height:100%;object-fit:cover}
.video-placeholder-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(to bottom,oklch(0% 0 0/.3),oklch(0% 0 0/.1) 50%,oklch(0% 0 0/.4))}
.video-placeholder-content{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:var(--space-md)}
.video-icon{width:64px;height:64px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:#fff;border:1px solid rgba(255,255,255,.5);border-radius:50%;transition:all var(--duration-medium) var(--ease-out-expo)}
.video-container:hover .video-icon{background:#fff;color:var(--color-text)}
.video-label{font-size:var(--text-lg);font-weight:300;letter-spacing:var(--tracking-wide);color:#ffffffe6}
.video-desc{font-size:var(--text-sm);font-weight:300;color:#fff9}
.cta{background:var(--color-text);padding-top:var(--space-6xl);padding-bottom:var(--space-6xl);text-align:center}
.cta-bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,oklch(35% .04 185),transparent);pointer-events:none}
.cta-content{position:relative;z-index:1}
.cta-title{font-size:var(--text-3xl);font-weight:200;letter-spacing:var(--tracking-wide);color:var(--color-text-inverse);margin-bottom:var(--space-2xl)}
.cta-actions{display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap}
.footer{background:var(--color-text);color:var(--color-text-inverse);padding:var(--space-4xl) var(--content-padding) var(--space-2xl)}
.footer-grid{display:grid;grid-template-columns:1fr 2fr;gap:var(--space-4xl);padding-bottom:var(--space-3xl);border-bottom:1px solid oklch(30% .01 260)}
.footer-logo{font-size:var(--text-lg);font-weight:500;letter-spacing:var(--tracking-wide)}
.footer-tagline{font-size:var(--text-sm);font-weight:300;color:oklch(65% .01 260);margin-top:var(--space-sm)}
.footer-links{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-xl)}
.footer-col-title{font-size:var(--text-sm);font-weight:500;letter-spacing:var(--tracking-wide);margin-bottom:var(--space-lg);color:var(--color-text-inverse)}
.footer-link{display:block;font-size:var(--text-sm);font-weight:300;color:oklch(65% .01 260);text-decoration:none;margin-bottom:var(--space-md)}
.footer-link:hover{color:var(--color-text-inverse)}
.footer-bottom{padding-top:var(--space-lg)}
.footer-copy{font-size:var(--text-xs);font-weight:300;color:oklch(40% .01 260)}
@media(max-width:768px){.footer-grid{grid-template-columns:1fr;gap:var(--space-2xl)}.footer-links{grid-template-columns:1fr 1fr}}
</style></head><body>

<nav class="nav"><div class="nav-inner">
  <a href="/" class="nav-logo" aria-label="海得宝首页"><img src="${imgs['assets/logo-brand.png']}" alt="海得宝" class="nav-logo-img" width="96" height="96"></a>
  <div class="nav-links">
    <a href="#story" class="nav-link">品牌故事</a>
    <a href="#science" class="nav-link">CAPCS<sup>®</sup></a>
    <a href="#products" class="nav-link">产品</a>
    <a href="#trust" class="nav-link">临床验证</a>
  </div>
</div></nav>

<main>
<section class="hero section-full">
  <div class="hero-bg-video" aria-hidden="true">
    <video class="hero-video" src="assets/brand-video.mp4" autoplay muted loop playsinline preload="auto"></video>
    <div class="hero-video-overlay"></div>
  </div>
  <div class="hero-content">
    <h1 class="hero-logo reveal"><img src="${imgs['assets/logo.png']}" alt="海得宝 MarTempo" class="hero-logo-img" width="600" height="200"></h1>
    <p class="hero-subtitle reveal reveal-delay-2">深海珍宝 · 敏感肌家庭的专业守护</p>
    <p class="hero-desc reveal reveal-delay-3">以自研 CAPCS<sup>®</sup> 凯普斯泰，从 10000 只贻贝中提取 1 克珍稀成分<br>实现天然无激素止痒，全国 1000+ 公立医院皮肤科临床验证</p>
    <div class="hero-actions reveal reveal-delay-4">
      <a href="#story" class="btn btn-outline">探索品牌故事</a>
      <a href="#products" class="btn btn-primary">查看产品</a>
    </div>
  </div>
  <div class="hero-scroll-hint" aria-hidden="true">
    <span class="hero-scroll-text">滚动探索</span>
    <span class="hero-scroll-line"></span>
  </div>
</section>

<section id="story" class="section story">
  <div class="story-bg" aria-hidden="true"></div>
  <div class="section-inner">
    <div class="story-panel reveal"><div class="story-grid">
      <div class="story-text"><span class="eyebrow">深海起源</span><h2 class="story-title">深海中<br>的珍宝</h2>
        <p class="story-body">MarTempo 海得宝，意为"深海中的珍宝"。源于创始人数十年的执着：走遍全球 50 多个纯净海域，历经 13 年研发和上万次测试，最终在全球不到 1% 的纯净海域中发现了珍稀贻贝。</p>
        <p class="story-body">通过独创的纯物理回流反渗技术，从 10000 只纯净贻贝中精粹出仅 1 克的灵魂成分——贻贝提取物（凯普斯泰 CAPCS<sup>®</sup>）。经全国 1000 家公立皮肤科长达 5 年验证，成为 30 秒舒缓红痒的天然止痒方案。</p>
      </div>
      <div class="story-visual"><img class="story-image" src="${imgs['assets/lifestyle-mother.jpg']}" alt="海得宝 · 母女温和相伴" width="600" height="800"></div>
    </div></div>
    <div class="story-panel reveal"><div class="story-grid story-grid-reverse">
      <div class="story-text"><span class="eyebrow">天然力量</span><h2 class="story-title">来自深海的<br>自然馈赠</h2>
        <p class="story-body">在全球不到 1% 的纯净海域中孕育的珍稀贻贝，蕴藏着大自然最纯粹的舒缓力量。海得宝坚持极简配方哲学——只添加必要的有效成分，不添加激素、抗生素、防腐剂。</p>
        <p class="story-body">独创的纯物理回流反渗萃取技术，全程无化学溶剂参与。从贻贝中提取的钙离子复合物 CAPCS<sup>®</sup>，通过干扰痒信号传导实现天然止痒，温和而高效。</p>
      </div>
      <div class="story-visual"><img class="story-image" src="${imgs['assets/ingredient-honeysuckle.jpg']}" alt="海得宝 · 天然草本成分" width="600" height="800"></div>
    </div></div>
    <div class="story-panel reveal"><div class="story-grid">
      <div class="story-text"><span class="eyebrow">科研基石</span><h2 class="story-title">13 年潜心<br>验证于临床</h2>
        <p class="story-body">由生物学博士后团队领衔，13 年自主研发，上万次实验。海得宝的核心成分 CAPCS<sup>®</sup> 发表于《中华皮肤科杂志》与 SCI 期刊，机理与临床双重验证。</p>
        <p class="story-body">北京友谊医院双盲对照研究证实：止痒效果等同于弱效激素，止痒速度优于弱效激素。四川大学华西医院进一步证明，海得宝能提高激素有效率高达 6 倍。</p>
      </div>
      <div class="story-visual"><img class="story-image" src="${imgs['assets/product-medical.jpg']}" alt="海得宝 · 专业线产品" width="600" height="800"></div>
    </div></div>
    <div class="story-panel reveal"><div class="story-grid story-grid-reverse">
      <div class="story-text"><span class="eyebrow">家庭之选</span><h2 class="story-title">200 万家庭<br>的信赖之选</h2>
        <p class="story-body">从新生儿的第一管面霜，到妈妈的日常修护，再到老人的换季止痒——海得宝为全家人提供一生相伴的敏感肌护理方案。</p>
        <p class="story-body">全国 1000+ 公立医院皮肤科临床使用，3000+ 皮肤科 / 儿科医生推荐。五维金标准安全检测：经口无毒、入眼无刺激，全家用得安心。</p>
      </div>
      <div class="story-visual"><img class="story-image" src="${imgs['assets/scene-flatlay.jpg']}" alt="海得宝 · 产品静物" width="600" height="800"></div>
    </div></div>
    <div class="story-numbers-row reveal">
      <div class="story-number"><span class="story-number-value">13</span><span class="story-number-label">年研发</span></div>
      <div class="story-number"><span class="story-number-value">10,000</span><span class="story-number-label">只贻贝 → 1克精华</span></div>
      <div class="story-number"><span class="story-number-value">1,000+</span><span class="story-number-label">公立医院验证</span></div>
      <div class="story-number"><span class="story-number-value">200万+</span><span class="story-number-label">敏感肌家庭信赖</span></div>
    </div>
  </div>
</section>

<section id="science" class="section science">
  <div class="section-inner">
    <div class="science-header reveal">
      <span class="eyebrow">核心成分</span>
      <h2 class="science-title">CAPCS<sup>®</sup> 凯普斯泰</h2>
      <p class="science-subtitle">全球首创外用钙离子舒缓技术</p>
    </div>
    <div class="science-grid">
      <div class="science-card reveal reveal-delay-1"><div class="science-card-icon">⚡</div><h3 class="science-card-title">30 秒快速止痒</h3><p class="science-card-body">临床验证止痒速度优于弱效激素（氢化可的松），效果等同于弱效激素。切断"搔抓恶性循环"，从根源缓解皮肤问题。</p></div>
      <div class="science-card reveal reveal-delay-2"><div class="science-card-icon">🧪</div><h3 class="science-card-title">13 年自主研发</h3><p class="science-card-body">由生物学博士后团队研发，纯物理回流反渗技术萃取。发表于《中华皮肤科杂志》与 SCI 期刊，机理与临床双重验证。</p></div>
      <div class="science-card reveal reveal-delay-3"><div class="science-card-icon">🛡️</div><h3 class="science-card-title">五维金标准安全</h3><p class="science-card-body">无激素、无抗生素、无防腐剂。经口无毒、入眼无刺激、人体斑贴无刺激、多次皮肤刺激无刺激、4000+ 争议成分不添加。</p></div>
    </div>
    <div class="science-data reveal">
      <div class="science-data-item"><span class="science-data-value">79%</span><span class="science-data-label">止痒有效率</span></div>
      <div class="science-data-divider" aria-hidden="true"></div>
      <div class="science-data-item"><span class="science-data-value">67%</span><span class="science-data-label">特应性皮炎治疗有效率</span></div>
      <div class="science-data-divider" aria-hidden="true"></div>
      <div class="science-data-item"><span class="science-data-value">6×</span><span class="science-data-label">提高激素有效率</span></div>
    </div>
  </div>
</section>

<section id="products" class="section products">
  <div class="section-inner">
    <div class="products-header reveal">
      <span class="eyebrow">精选系列</span>
      <h2 class="products-title">以专业，呵护每一寸敏感</h2>
      <p class="products-subtitle">为全家人不同肤质量身打造</p>
    </div>
    <div class="products-grid">${productCards}</div>
  </div>
</section>

<section id="trust" class="section trust">
  <div class="section-inner">
    <div class="trust-content reveal">
      <span class="eyebrow">临床验证</span>
      <h2 class="trust-title">学术与临床<br>双重背书</h2>
    </div>
    <div class="trust-grid">
      <div class="trust-card reveal reveal-delay-1"><span class="trust-card-number">1,000+</span><span class="trust-card-label">公立医院皮肤科临床使用</span></div>
      <div class="trust-card reveal reveal-delay-2"><span class="trust-card-number">3,000+</span><span class="trust-card-label">皮肤科 / 儿科医生推荐</span></div>
      <div class="trust-card reveal reveal-delay-3"><span class="trust-card-number">200万+</span><span class="trust-card-label">敏感肌家庭的信赖选择</span></div>
    </div>
    <div class="trust-academic reveal">
      <h3 class="trust-academic-title">学术发表</h3>
      <div class="trust-academic-list">
        <div class="trust-academic-item"><span class="trust-academic-source">中华皮肤科杂志 · 2022</span><p class="trust-academic-detail">北京友谊医院：止痒效果等同于弱效激素，止痒速度优于弱效激素</p></div>
        <div class="trust-academic-item"><span class="trust-academic-source">SCI · IJMS · 2022</span><p class="trust-academic-detail">四川大学华西医院：证明海得宝能提高激素有效率高达 6 倍</p></div>
        <div class="trust-academic-item"><span class="trust-academic-source">中山大学第五医院</span><p class="trust-academic-detail">治疗特应性皮炎有效率 67%，止痒有效率 79%</p></div>
      </div>
    </div>
  </div>
</section>

<section class="section video-section">
  <div class="video-container reveal">
    <div class="video-placeholder">
      <div class="video-placeholder-bg"><img class="video-placeholder-img" src="${imgs['assets/lifestyle-mother.jpg']}" alt="" aria-hidden="true"></div>
      <div class="video-placeholder-overlay"></div>
      <div class="video-placeholder-content">
        <span class="video-icon" aria-hidden="true">▶</span>
        <p class="video-label">深海 · 珍稀 · 守护</p>
        <p class="video-desc">海得宝品牌故事</p>
      </div>
    </div>
  </div>
</section>

<section class="section cta">
  <div class="cta-bg" aria-hidden="true"></div>
  <div class="section-inner">
    <div class="cta-content reveal">
      <span class="eyebrow" style="color:var(--color-text-muted)">用心呵护敏感，用爱温暖家庭</span>
      <h2 class="cta-title">让每一个敏感肌肤家庭，<br>都能找到安心之选</h2>
      <div class="cta-actions">
        <a href="#" class="btn btn-primary">探索全系列产品</a>
        <a href="#" class="btn btn-outline" style="border-color:rgba(255,255,255,.3);color:rgba(255,255,255,.8)">咨询 1v1 顾问</a>
      </div>
    </div>
  </div>
</section>
</main>

<footer class="footer">
  <div class="section-inner">
    <div class="footer-grid">
      <div class="footer-brand"><span class="footer-logo">✦ 海得宝</span><p class="footer-tagline">敏感肌家庭的专业守护</p></div>
      <div class="footer-links">
        <div class="footer-col"><h4 class="footer-col-title">关于</h4><a href="#" class="footer-link">品牌故事</a><a href="#" class="footer-link">CAPCS® 科技</a><a href="#" class="footer-link">临床验证</a></div>
        <div class="footer-col"><h4 class="footer-col-title">服务</h4><a href="#" class="footer-link">1v1护理方案</a><a href="#" class="footer-link">产品使用指南</a><a href="#" class="footer-link">联系我们</a></div>
      </div>
    </div>
    <div class="footer-bottom"><p class="footer-copy">© 2025 海得宝 MarTempo. All rights reserved.</p></div>
  </div>
</footer>

<script>
document.addEventListener('DOMContentLoaded',()=>{
  const r=document.querySelectorAll('.reveal');
  if(!r.length)return;
  const o=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(t.target.classList.add('visible'),o.unobserve(t.target))})},{threshold:.15,rootMargin:'0px 0px -50px 0px'});
  r.forEach(e=>o.observe(e))
});
</script>
</body></html>`;

writeFileSync(resolve(OUT, 'index.html'), html, 'utf-8');

const hSize = (readFileSync(resolve(OUT, 'index.html')).length / 1024 / 1024).toFixed(2);
const vSize = (readFileSync(resolve(OUT, 'assets/brand-video.mp4')).length / 1024 / 1024).toFixed(2);
console.log('✅ 生成完成!');
console.log(`   📄 index.html  (${hSize} MB，所有图片已内嵌base64)`);
console.log(`   📹 assets/brand-video.mp4  (${vSize} MB)`);
console.log('\n将 haidebao-standalone 文件夹整个发送，对方打开 index.html 即可看到效果');
