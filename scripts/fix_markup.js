import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// 1. Insert heroInstallCard before <div class="card resume" id="resumeCard"></div>
const targetResume = '<div class="card resume" id="resumeCard"></div>';
const heroInstallMarkup = `<!-- PWA Install & Offline Feature Card -->
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
        </div>\n        <div class="card resume" id="resumeCard"></div>`;

if (!html.includes('id="heroInstallCard" style="display:flex;align-items:center;')) {
  html = html.replace(targetResume, heroInstallMarkup);
  console.log('✓ heroInstallCard added to Home view');
}

// 2. Move installBanner, iosModalBackdrop, offlineToast from after </script> to before </main> or inside #app before <script
// Let's remove them from after </script>
const bottomPwaRegex = /\s*<!-- Visitor In-App Install Banner -->[\s\S]*?<!-- Real-time Offline Connectivity Toast -->[\s\S]*?<\/div>\s*(?=<\/body>)/;
const match = html.match(bottomPwaRegex);
if (match) {
  const pwaMarkup = match[0];
  html = html.replace(bottomPwaRegex, '');
  
  // Insert before <script type="module">
  const scriptTag = '<script type="module">';
  html = html.replace(scriptTag, `${pwaMarkup}\n\n${scriptTag}`);
  console.log('✓ Moved PWA banners and modals before <script type="module">');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ index.html markup adjustments saved');
