import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update <head> meta tags and icon links
const oldHeadTags = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#F6F1E9">
<title>ଓଡ଼ିଆ କବି ପରିଚୟ, ଉପାଧି, ପ୍ରଦାତା, ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ, ଲେଖନ ଶୈଳୀ ଓ କୃତି ମଞ୍ଜୁଷା</title>
<meta name="description" content="ଓଡ଼ିଆ ସାହିତ୍ୟର ସମସ୍ତ କବି, ଔପନ୍ୟାସିକ, ଗାଳ୍ପିକ, ସେମାନଙ୍କ ଉପାଧି ଓ ପ୍ରଦାନକାରୀ, ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ, ଲେଖନ ଶୈଳୀ, ପୁରସ୍କାର, କାଳଜୟୀ କବିତା, ଉପନ୍ୟାସ ଓ ଛାତ୍ର ଅଧ୍ୟୟନ ସହାୟକ ।">
<meta property="og:title" content="ଓଡ଼ିଆ କବି ପରିଚୟ, ଉପାଧି, ପ୍ରଦାତା, ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ, ଲେଖନ ଶୈଳୀ ଓ କୃତି ମଞ୍ଜୁଷା">
<meta property="og:description" content="ଓଡ଼ିଆ ସାହିତ୍ୟର ସମସ୍ତ କବି, ଔପନ୍ୟାସିକ, ଗାଳ୍ପିକ, ସେମାନଙ୍କ ଉପାଧି ଓ ପ୍ରଦାନକାରୀ, ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ, ଲେଖନ ଶୈଳୀ, ପୁରସ୍କାର, କାଳଜୟୀ କବିତା, ଉପନ୍ୟାସ ଓ ଛାତ୍ର ଅଧ୍ୟୟନ ସହାୟକ ।">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">`;

const newHeadTags = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<meta name="theme-color" content="#9C3B1B">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="ଓଡ଼ିଆ ସାହିତ୍ୟ">
<meta name="application-name" content="ଓଡ଼ିଆ ସାହିତ୍ୟ">
<title>ଓଡ଼ିଆ ସାହିତ୍ୟ ଓ କବି ମଞ୍ଜୁଷା</title>
<meta name="description" content="ଓଡ଼ିଆ ଭାଷା, ସାହିତ୍ୟ, ପ୍ରସିଦ୍ଧ କବି, ଔପନ୍ୟାସିକ, ଗାଳ୍ପିକ, କାଳଜୟୀ କବିତା ଓ ଉପନ୍ୟାସର ସମୃଦ୍ଧ ସଂଗ୍ରହ ଓ ପଠନ ଆପ୍ ।">
<meta property="og:title" content="ଓଡ଼ିଆ ସାହିତ୍ୟ ଓ କବି ମଞ୍ଜୁଷା">
<meta property="og:description" content="ଓଡ଼ିଆ ଭାଷା, ସାହିତ୍ୟ, ପ୍ରସିଦ୍ଧ କବି, ଔପନ୍ୟାସିକ, ଗାଳ୍ପିକ, କାଳଜୟୀ କବିତା ଓ ଉପନ୍ୟାସର ସମୃଦ୍ଧ ସଂଗ୍ରହ ଓ ପଠନ ଆପ୍ ।">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" type="image/svg+xml" href="/icon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/pwa-192x192.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

if (html.includes(oldHeadTags)) {
  html = html.replace(oldHeadTags, newHeadTags);
  console.log('✓ Head tags updated');
} else {
  console.warn('Head tags match not found, checking alternatives...');
}

// 2. Add PWA CSS styles before </style>
const pwaCss = `
/* ============ PWA & OFFLINE STYLES ============ */
.install-banner{
  position:fixed;bottom:78px;left:16px;right:16px;max-width:498px;margin:0 auto;
  background:var(--surface);border:1.5px solid var(--primary);border-radius:20px;
  box-shadow:var(--shadow-lg);padding:13px 16px;display:flex;align-items:center;gap:12px;
  z-index:90;animation:pwaSlideUp .3s cubic-bezier(.16,1,.3,1);backdrop-filter:blur(10px);
}
@keyframes pwaSlideUp{
  from{transform:translateY(30px);opacity:0}
  to{transform:translateY(0);opacity:1}
}
.ib-icon{
  width:46px;height:46px;flex:0 0 46px;border-radius:12px;overflow:hidden;
  box-shadow:0 4px 12px rgba(156,59,27,.25);border:1px solid var(--border);
}
.ib-icon img{width:100%;height:100%;object-fit:cover;display:block}
.ib-content{flex:1;min-width:0}
.ib-title{font-size:13.5px;font-weight:700;color:var(--text);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ib-desc{font-size:11px;color:var(--muted);margin-top:2px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ib-actions{display:flex;align-items:center;gap:6px;flex:0 0 auto}
.ib-btn-primary{
  background:linear-gradient(135deg,var(--primary2),var(--primary));
  color:#fff;border-radius:999px;padding:7px 14px;font-size:12px;font-weight:700;
  display:inline-flex;align-items:center;gap:5px;box-shadow:0 4px 12px rgba(156,59,27,.25);
}
.ib-btn-primary:active{transform:scale(.95)}
.ib-btn-ghost{
  width:30px;height:30px;border-radius:50%;display:grid;place-items:center;
  color:var(--muted);font-size:14px;font-weight:700;
}
.ib-btn-ghost:active{transform:scale(.92)}

.topbar-actions{display:flex;align-items:center;gap:8px}
.btn-install-chip{
  background:var(--primary-soft);color:var(--primary);border:1px solid rgba(156,59,27,.2);
  border-radius:999px;padding:6px 12px;font-size:11.5px;font-weight:700;
  display:inline-flex;align-items:center;gap:5px;transition:transform .15s;
}
.btn-install-chip:active{transform:scale(.95)}
.btn-install-chip svg{width:15px;height:15px}

.offline-toast{
  position:fixed;top:14px;left:16px;right:16px;max-width:498px;margin:0 auto;
  background:#A56005;color:#fff;border-radius:14px;padding:10px 14px;
  display:flex;align-items:center;gap:9px;font-size:12px;font-weight:600;
  box-shadow:0 8px 24px rgba(0,0,0,.25);z-index:150;animation:pwaFadeInDown .25s ease;
}
@keyframes pwaFadeInDown{
  from{transform:translateY(-20px);opacity:0}
  to{transform:translateY(0);opacity:1}
}
.offline-dot{width:8px;height:8px;border-radius:50%;background:#FFF;animation:pulseDot 1.5s infinite;flex:0 0 8px}
@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.3}}

.guide-step{display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;padding:10px 12px;background:var(--surface2);border-radius:12px;border:1px solid var(--border)}
.guide-num{width:24px;height:24px;border-radius:50%;background:var(--primary);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:700;flex:0 0 24px}
.guide-txt{font-size:13px;line-height:1.55;color:var(--text)}
`;

html = html.replace('</style>', `${pwaCss}\n</style>`);
console.log('✓ PWA CSS injected');

// 3. Update topbar in home view to include install button
const oldHomeTopbar = `<div class="topbar">
        <div>
          <h1 class="app-title">ଓଡ଼ିଆ କବି ଓ କୃତି</h1>
          <div class="app-sub">କବି ପରିଚୟ, ଉପାଧି, ପ୍ରଦାତା, ଲେଖନ ଶୈଳୀ ଓ କାଳଜୟୀ ଗ୍ରନ୍ଥ</div>
        </div>
        <button class="iconbtn" id="topThemeBtn" title="ଥିମ୍ ବଦଳାନ୍ତୁ">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        </button>
      </div>`;

const newHomeTopbar = `<div class="topbar">
        <div>
          <h1 class="app-title">ଓଡ଼ିଆ କବି ଓ କୃତି</h1>
          <div class="app-sub">କବି ପରିଚୟ, ଉପାଧି, ପ୍ରଦାତା, ଲେଖନ ଶୈଳୀ ଓ କାଳଜୟୀ ଗ୍ରନ୍ଥ</div>
        </div>
        <div class="topbar-actions">
          <button class="btn-install-chip" id="btnTopInstall" title="ଆପ୍ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>ଇନଷ୍ଟଲ୍</span>
          </button>
          <button class="iconbtn" id="topThemeBtn" title="ଥିମ୍ ବଦଳାନ୍ତୁ">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          </button>
        </div>
      </div>`;

if (html.includes(oldHomeTopbar)) {
  html = html.replace(oldHomeTopbar, newHomeTopbar);
  console.log('✓ Home topbar updated');
} else {
  // Try flexible regex replace
  html = html.replace(/<div class="topbar">\s*<div>\s*<h1 class="app-title">ଓଡ଼ିଆ କବି ଓ କୃତି<\/h1>[\s\S]*?<button class="iconbtn" id="topThemeBtn"[\s\S]*?<\/button>\s*<\/div>/, newHomeTopbar);
  console.log('✓ Home topbar replaced via regex');
}

// 4. Add heroInstallCard in Home view after hero card
const heroInstallMarkup = `
        <!-- PWA Install & Offline Feature Card -->
        <div class="card" id="heroInstallCard" style="display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,var(--surface2),var(--surface));border:1.5px dashed var(--primary);padding:13px 15px;margin-bottom:12px;cursor:pointer;">
          <div style="width:42px;height:42px;border-radius:12px;background:var(--primary-soft);display:grid;place-items:center;color:var(--primary);flex:0 0 42px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px;"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:6px;">
              ଆପ୍ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ (PWA)
              <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:var(--accent-soft);color:var(--accent);font-weight:700;">ଅଫ୍‌ଲାଇନ୍ ରେଡି</span>
            </div>
            <div style="font-size:11.5px;color:var(--muted);margin-top:2px;line-height:1.4;">
              ଫୋନ୍ ବା କମ୍ପ୍ୟୁଟରରେ ସ୍ଥାପନ କରି ବିନା ଇଣ୍ଟରନେଟ୍‌ରେ ସମ୍ପୂର୍ଣ୍ଣ ବ୍ୟବହାର କରନ୍ତୁ ।
            </div>
          </div>
          <button class="btn" id="btnHeroInstall" style="padding:7px 14px;font-size:12px;">ଇନଷ୍ଟଲ୍</button>
        </div>`;

if (!html.includes('id="heroInstallCard"')) {
  html = html.replace('<!-- Resume card -->', `${heroInstallMarkup}\n\n        <!-- Resume card -->`);
  console.log('✓ heroInstallCard added to Home view');
}

// 5. Add PWA Install row in Settings view
const settingsPwaRow = `
        <!-- PWA Status & Install Section -->
        <div class="card" style="margin-bottom:14px;padding:16px;">
          <div style="font-size:14px;font-weight:700;color:var(--primary);display:flex;align-items:center;gap:7px;margin-bottom:8px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ଆପ୍ ଇନଷ୍ଟଲେସନ୍ ଓ ଅଫ୍‌ଲାଇନ୍ ସ୍ଥିତି (PWA)
          </div>
          <div style="font-size:12.5px;color:var(--muted);line-height:1.6;margin-bottom:12px;">
            ଏହି ୱେବ୍ ଆପ୍ କୁ ନିଜ ମୋବାଇଲ୍ ବା କମ୍ପ୍ୟୁଟରର ହୋମ୍ ସ୍କ୍ରିନ୍‌ରେ ସ୍ଥାପନ କରିବା ପରେ ଇଣ୍ଟରନେଟ୍ ବିନା ସମସ୍ତ ୯୨ ଜଣ କବିଙ୍କ ଜୀବନୀ, ଉପାଧି, ପ୍ରଦାତା, କବିତା ଓ ପ୍ରଶ୍ନୋତ୍ତର ପଢ଼ିପାରିବେ ।
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;background:var(--surface2);border-radius:12px;border:1px solid var(--border);">
            <div>
              <div style="font-size:12px;font-weight:700;color:var(--text);" id="pwaStatusText">ସ୍ଥିତି: ଯାଞ୍ଚ ଚାଲିଛି...</div>
              <div style="font-size:11px;color:var(--muted);margin-top:2px;" id="pwaStatusSub">ସର୍ଭିସ୍ ୱାର୍କର୍ ଓ ଅଫ୍‌ଲାଇନ୍ କ୍ୟାଚ୍ ସକ୍ରିୟ</div>
            </div>
            <button class="btn" id="btnSettingsInstall" style="padding:7px 16px;font-size:12px;">ସ୍ଥାପନ କରନ୍ତୁ</button>
          </div>
        </div>`;

if (!html.includes('id="btnSettingsInstall"')) {
  html = html.replace('<div class="set-row">\n          <div class="sbody">\n            <div class="sname">ପଠନ ସ୍ଥିତି ଓ ବୁକମାର୍କ</div>', `${settingsPwaRow}\n\n        <div class="set-row">\n          <div class="sbody">\n            <div class="sname">ପଠନ ସ୍ଥିତି ଓ ବୁକମାର୍କ</div>`);
  console.log('✓ Settings PWA row added');
}

// 6. Add Visitor Install Banner, iOS Modal, and Offline Toast before </body>
const bottomPwaMarkup = `
  <!-- Visitor In-App Install Banner -->
  <div id="installBanner" class="install-banner" style="display:none;">
    <div class="ib-icon">
      <img src="/pwa-192x192.png" alt="Odia Sahitya App Icon" width="46" height="46">
    </div>
    <div class="ib-content">
      <div class="ib-title">ଓଡ଼ିଆ କବି ଓ ସାହିତ୍ୟ ଆପ୍ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ</div>
      <div class="ib-desc">ଅଫ୍‌ଲାଇନ୍ (Offline) ରେ ସମ୍ପୂର୍ଣ୍ଣ ଚାଲିବ • ସହଜ ପ୍ରବେଶ</div>
    </div>
    <div class="ib-actions">
      <button id="btnBannerInstall" class="ib-btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;display:inline-block;vertical-align:-1px;margin-right:3px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ଇନଷ୍ଟଲ୍
      </button>
      <button id="btnBannerDismiss" class="ib-btn-ghost" title="ପରେ">✕</button>
    </div>
  </div>

  <!-- iOS Safari Install Guidance Modal -->
  <div class="modal-backdrop" id="iosModalBackdrop" style="display:none;">
    <div class="modal-card" style="max-height:85vh;">
      <div class="modal-header">
        <div class="modal-header-text">
          <h2 class="modal-name">iPhone / iPad ରେ ଆପ୍ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ</h2>
          <div class="modal-sub">ହୋମ୍ ସ୍କ୍ରିନ୍‌ରେ ସ୍ଥାପନ କରି ଅଫ୍‌ଲାଇନ୍ ପଢ଼ନ୍ତୁ</div>
        </div>
        <button class="iconbtn modal-close-btn" id="iosModalCloseBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="padding:16px;">
        <div class="guide-step">
          <div class="guide-num">୧</div>
          <div class="guide-txt">
            Safari ବ୍ରାଉଜରର ତଳେ (ବା ଉପରେ) ଥିବା <b>Share (ସେୟାର୍) <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;display:inline-block;vertical-align:-2px;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></b> ଆଇକନ୍ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ ।
          </div>
        </div>
        <div class="guide-step">
          <div class="guide-num">୨</div>
          <div class="guide-txt">
            ମେନୁ ତଳକୁ ସ୍କ୍ରୋଲ୍ କରି <b>'Add to Home Screen (ହୋମ୍ ସ୍କ୍ରିନ୍‌ରେ ଯୋଡ଼ନ୍ତୁ ➕)'</b> ବିକଳ୍ପ ବାଛନ୍ତୁ ।
          </div>
        </div>
        <div class="guide-step">
          <div class="guide-num">୩</div>
          <div class="guide-txt">
            ଡାହାଣ ପାଖ ଉପରେ ଥିବା <b>'Add (ଯୋଡ଼ନ୍ତୁ)'</b> ବଟନ୍ ଦବାନ୍ତୁ । ଆପ୍ ଆପଣଙ୍କ ହୋମ୍ ସ୍କ୍ରିନ୍‌ରେ ସ୍ଥାପିତ ହୋଇଯିବ !
          </div>
        </div>
        <button class="btn" id="iosModalDoneBtn" style="width:100%;padding:11px;margin-top:8px;">ଠିକ୍ ଅଛି (ବୁଝିଲି)</button>
      </div>
    </div>
  </div>

  <!-- Real-time Offline Connectivity Toast -->
  <div id="offlineToast" class="offline-toast" style="display:none;">
    <span class="offline-dot"></span>
    <span id="offlineToastMsg">📶 ଅଫ୍‌ଲାଇନ୍ ମୋଡ୍ ସକ୍ରିୟ — ବିନା ଇଣ୍ଟରନେଟ୍‌ରେ ସମସ୍ତ ତଥ୍ୟ ପଢ଼ିପାରିବେ ।</span>
  </div>
`;

if (!html.includes('id="installBanner"')) {
  html = html.replace('</body>', `${bottomPwaMarkup}\n</body>`);
  console.log('✓ Bottom PWA markup added');
}

// 7. Add PWA JavaScript controller into the script block
const pwaJsCode = `
    /* ============ PWA & OFFLINE CONTROLLER ============ */
    let deferredPrompt = null;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator && window.navigator.standalone === true);
    const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

    function updatePWAStatusUI() {
      const statusText = $('#pwaStatusText');
      const statusSub = $('#pwaStatusSub');
      const btnSettings = $('#btnSettingsInstall');
      const topInstall = $('#btnTopInstall');
      const heroCard = $('#heroInstallCard');

      if (isStandalone) {
        if (statusText) statusText.innerHTML = '✅ <span style="color:var(--accent);">ଆପ୍ ସ୍ଥାପିତ ହୋଇଛି (Installed)</span>';
        if (statusSub) statusSub.textContent = 'ଅଫ୍‌ଲାଇନ୍ ମୋଡ୍ ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରସ୍ତୁତ';
        if (btnSettings) {
          btnSettings.textContent = 'ସ୍ଥାପିତ';
          btnSettings.disabled = true;
          btnSettings.style.opacity = '0.6';
        }
        if (topInstall) topInstall.style.display = 'none';
        if (heroCard) heroCard.style.display = 'none';
        const banner = $('#installBanner');
        if (banner) banner.style.display = 'none';
      } else {
        if (statusText) statusText.textContent = 'ସ୍ଥିତି: ବ୍ରାଉଜର ସଂସ୍କରଣ';
        if (statusSub) statusSub.textContent = 'ହୋମ୍ ସ୍କ୍ରିନ୍‌ରେ ଯୋଡ଼ିଲେ ଅଫ୍‌ଲାଇନ୍ ଚାଲିବ';
        if (topInstall) topInstall.style.display = 'inline-flex';
        if (heroCard) heroCard.style.display = 'flex';
      }
    }

    async function triggerAppInstall() {
      if (isStandalone) {
        toast('✅ ଆପ୍ ପୂର୍ବରୁ ସଫଳତାର ସହ ଇନଷ୍ଟଲ୍ ହୋଇଛି !');
        return;
      }
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          toast('🎉 ଆପ୍ ଇନଷ୍ଟଲେସନ୍ ଆରମ୍ଭ ହେଲା !');
          const banner = $('#installBanner');
          if (banner) banner.style.display = 'none';
        }
        deferredPrompt = null;
      } else if (isIOS) {
        openIOSInstallModal();
      } else {
        // Desktop Chrome / Android where prompt is in browser menu or already triggered
        toast('📱 Chrome ମେନୁ (⋮) ଖୋଲି "Install app" ବା "Add to Home screen" ବାଛନ୍ତୁ ।', 4000);
      }
    }

    function openIOSInstallModal() {
      const modal = $('#iosModalBackdrop');
      if (modal) modal.style.display = 'flex';
    }

    function closeIOSInstallModal() {
      const modal = $('#iosModalBackdrop');
      if (modal) modal.style.display = 'none';
    }

    function showVisitorInstallBanner() {
      if (isStandalone) return;
      const dismissedTime = localStorage.getItem('odia_pwa_banner_dismissed');
      if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 24 * 60 * 60 * 1000) {
        return; // Don't show if dismissed within 24 hours
      }
      setTimeout(() => {
        const banner = $('#installBanner');
        if (banner && !isStandalone) {
          banner.style.display = 'flex';
        }
      }, 1000);
    }

    // Service Worker Registration
    function initServiceWorker() {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((reg) => {
              console.log('Odia Sahitya ServiceWorker registered with scope:', reg.scope);
            })
            .catch((err) => {
              console.warn('Odia Sahitya ServiceWorker registration warning:', err);
            });
        });
      }
    }

    // Network connectivity detection
    function initNetworkListeners() {
      const offlineToast = $('#offlineToast');
      const offlineToastMsg = $('#offlineToastMsg');

      function handleOnline() {
        if (offlineToast) {
          offlineToast.style.background = '#1F6E5C';
          if (offlineToastMsg) offlineToastMsg.textContent = '🟢 ଇଣ୍ଟରନେଟ୍ ସଂଯୋଗ ପୁନଃସ୍ଥାପିତ ହେଲା !';
          offlineToast.style.display = 'flex';
          setTimeout(() => {
            offlineToast.style.display = 'none';
          }, 3000);
        }
      }

      function handleOffline() {
        if (offlineToast) {
          offlineToast.style.background = '#A56005';
          if (offlineToastMsg) offlineToastMsg.textContent = '📶 ଅଫ୍‌ଲାଇନ୍ ମୋଡ୍ ସକ୍ରିୟ — ସମସ୍ତ ୯୨ ଜଣ କବି, କବିତା ଓ ପ୍ରଶ୍ନୋତ୍ତର ଅଫ୍‌ଲାଇନ୍ ଉପଲବ୍ଧ !';
          offlineToast.style.display = 'flex';
        }
      }

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      if (!navigator.onLine) {
        handleOffline();
      }
    }

    // Bind PWA UI Events
    function initPWAEvents() {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        updatePWAStatusUI();
        showVisitorInstallBanner();
      });

      window.addEventListener('appinstalled', () => {
        toast('🎉 ଓଡ଼ିଆ କବି ଓ ସାହିତ୍ୟ ଆପ୍ ସଫଳତାର ସହ ଇନଷ୍ଟଲ୍ ହେଲା !', 4000);
        deferredPrompt = null;
        updatePWAStatusUI();
      });

      // Topbar install button
      const topInstall = $('#btnTopInstall');
      if (topInstall) topInstall.onclick = triggerAppInstall;

      // Hero install button and card
      const heroCard = $('#heroInstallCard');
      if (heroCard) heroCard.onclick = (e) => {
        triggerAppInstall();
      };
      const btnHero = $('#btnHeroInstall');
      if (btnHero) btnHero.onclick = (e) => {
        e.stopPropagation();
        triggerAppInstall();
      };

      // Settings install button
      const btnSettings = $('#btnSettingsInstall');
      if (btnSettings) btnSettings.onclick = triggerAppInstall;

      // Floating banner install button
      const btnBanner = $('#btnBannerInstall');
      if (btnBanner) btnBanner.onclick = triggerAppInstall;

      // Floating banner dismiss button
      const btnDismiss = $('#btnBannerDismiss');
      if (btnDismiss) {
        btnDismiss.onclick = () => {
          const banner = $('#installBanner');
          if (banner) banner.style.display = 'none';
          localStorage.setItem('odia_pwa_banner_dismissed', Date.now().toString());
        };
      }

      // iOS modal close buttons
      const iosClose = $('#iosModalCloseBtn');
      if (iosClose) iosClose.onclick = closeIOSInstallModal;
      const iosDone = $('#iosModalDoneBtn');
      if (iosDone) iosDone.onclick = closeIOSInstallModal;
      const iosBackdrop = $('#iosModalBackdrop');
      if (iosBackdrop) {
        iosBackdrop.onclick = (e) => {
          if (e.target === iosBackdrop) closeIOSInstallModal();
        };
      }

      updatePWAStatusUI();
      showVisitorInstallBanner();
    }
`;

// Insert pwaJsCode before initEvents()
if (!html.includes('initPWAEvents()')) {
  html = html.replace('function init(){', `${pwaJsCode}\n\n  function init(){\n    initServiceWorker();\n    initNetworkListeners();\n    initPWAEvents();`);
  console.log('✓ PWA JS controller inserted');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html successfully updated with PWA & offline features!');
