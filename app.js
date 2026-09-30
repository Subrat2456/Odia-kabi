/* =========================================================
   ODIA SAHITYA APP - COMPLETE CONTROLLER & LOGIC (92 WRITERS)
   With Poet Upadhi, Upadhi Providers, Famous Books,
   Editions, Established Dates, Writing Styles, Awards & Student Helper
   ========================================================= */

(function(){
  const DB = window.ODIA_DATA || { poets: [], categories: [], student_guide: {} };

  const state = {
    currentPoetId: null,
    currentWorkId: null,
    currentVerseIdx: 0,
    category: 'all',
    activeView: 'home',
    activeTab: 'home',
    studySection: 'upadhi'
  };

  const navHistory = ['home'];

  const STORAGE = {
    SETTINGS: 'odia_sahitya_settings_v4',
    BOOKMARKS: 'odia_sahitya_bookmarks_v4',
    RESUME: 'odia_sahitya_resume_v4'
  };

  let settings = {
    theme: 'light',
    fontSize: 19,
    lineHeight: 1.95,
    style: 'two'
  };

  let bookmarks = [];
  let resume = null;

  /* ============ UTILS ============ */
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  const ODIA_DIGITS = ['୦','୧','୨','୩','୪','୫','୬','୭','୮','୯'];
  function toOdia(num){
    if (num === undefined || num === null) return '';
    return String(num).replace(/\d/g, d => ODIA_DIGITS[+d]);
  }

  function esc(s){
    if (s === undefined || s === null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toast(msg){
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._tm);
    toast._tm = setTimeout(() => t.classList.remove('show'), 2100);
  }

  /* ============ STORAGE ============ */
  function loadStorage(){
    try {
      const s = localStorage.getItem(STORAGE.SETTINGS);
      if (s) settings = Object.assign(settings, JSON.parse(s));
    } catch(e){}
    try {
      const b = localStorage.getItem(STORAGE.BOOKMARKS);
      if (b) bookmarks = JSON.parse(b);
    } catch(e){}
    try {
      const r = localStorage.getItem(STORAGE.RESUME);
      if (r) resume = JSON.parse(r);
    } catch(e){}
  }

  function saveSettings(){
    try { localStorage.setItem(STORAGE.SETTINGS, JSON.stringify(settings)); } catch(e){}
  }
  function saveBookmarks(){
    try { localStorage.setItem(STORAGE.BOOKMARKS, JSON.stringify(bookmarks)); } catch(e){}
  }
  function saveResume(){
    try { localStorage.setItem(STORAGE.RESUME, JSON.stringify(resume)); } catch(e){}
  }

  /* ============ NAVIGATION & HISTORY ============ */
  function showView(viewId, pushHistory = true){
    $$('.view').forEach(v => v.classList.remove('active'));
    const target = $(`#v-${viewId}`);
    if (target) target.classList.add('active');

    state.activeView = viewId;

    if (pushHistory){
      if (navHistory[navHistory.length - 1] !== viewId){
        navHistory.push(viewId);
      }
    }

    // Sync tabbar active state
    $$('.tabbar button').forEach(b => {
      const tab = b.dataset.tab;
      const isTab = (tab === 'home' && viewId === 'home') ||
                    (tab === 'works' && (viewId === 'works-all' || viewId === 'works')) ||
                    (tab === 'study' && viewId === 'study') ||
                    (tab === 'search' && viewId === 'search') ||
                    (tab === 'bm' && viewId === 'bm') ||
                    (tab === 'settings' && viewId === 'settings');
      b.classList.toggle('active', isTab);
    });

    // Custom view setups
    if (viewId === 'study'){
      renderStudySection(state.studySection);
    } else if (viewId === 'search'){
      renderSearch();
    } else if (viewId === 'bm'){
      renderBookmarks();
    } else if (viewId === 'works-all'){
      renderAllWorks();
    }
  }

  function goBack(){
    if (navHistory.length > 1){
      navHistory.pop(); // remove current view
      const prev = navHistory[navHistory.length - 1];
      showView(prev, false);
    } else {
      showView('home', false);
    }
  }

  /* ============ HOME VIEW ============ */
  function renderHome(){
    renderResumeCard();
    renderCategoryChips();
    renderPoetsList();
    renderBhashaSection();
  }

  function renderResumeCard(){
    const card = $('#resumeCard');
    if (!card) return;

    if (resume && resume.poetId && resume.workId){
      const p = DB.poets.find(x => x.id === resume.poetId);
      const w = p ? (p.works || []).find(x => x.id === resume.workId) : null;
      if (p && w){
        card.style.display = 'flex';
        card.innerHTML = `
          <div class="rbody">
            <div class="rlabel">ପୂର୍ବ ପଠନ ଜାରି ରଖନ୍ତୁ</div>
            <div class="rtitle">${esc(w.title)}</div>
            <div class="rsub">${esc(p.name)} (${esc(p.title)}) · ପଦ ${toOdia((resume.verseIdx || 0) + 1)}</div>
          </div>
          <button class="btn" id="resumeBtn">ପଢ଼ନ୍ତୁ</button>`;
        $('#resumeBtn').onclick = () => {
          openReader(p.id, w.id, resume.verseIdx || 0);
        };
        return;
      }
    }

    // Default card
    const firstP = DB.poets[0];
    const firstW = firstP && firstP.works ? firstP.works[0] : null;
    card.style.display = 'flex';
    card.innerHTML = `
      <div class="rbody">
        <div class="rlabel">ପ୍ରସ୍ତାବିତ ପଠନ</div>
        <div class="rtitle">${esc(firstW ? firstW.title : 'ସାରଳା ମହାଭାରତ')}</div>
        <div class="rsub">ଆଦିକବି ସାରଳା ଦାସଙ୍କ ଅମର ଦାଣ୍ଡି ବୃତ୍ତ ପଦ</div>
      </div>
      <button class="btn" id="startBtn">ପଢ଼ନ୍ତୁ</button>`;
    $('#startBtn').onclick = () => {
      if (firstP && firstW) openReader(firstP.id, firstW.id, 0);
    };
  }

  function renderCategoryChips(){
    const el = $('#catChips');
    if (!el) return;
    el.innerHTML = DB.categories.map(c => `
      <button class="cat-pill ${c.id === state.category ? 'active' : ''}" data-cat="${c.id}">
        ${esc(c.name)}
      </button>
    `).join('');
    $$('#catChips .cat-pill').forEach(b => {
      b.onclick = () => {
        state.category = b.dataset.cat;
        renderCategoryChips();
        renderPoetsList();
      };
    });
  }

  function renderPoetsList(){
    const wrap = $('#poetList');
    if (!wrap) return;
    let list = DB.poets;
    if (state.category === 'ancient'){
      list = DB.poets.filter(p => (p.num >= 1 && p.num <= 20) || p.category === 'ancient');
    } else if (state.category === 'modern'){
      list = DB.poets.filter(p => (p.num >= 21 && p.num <= 45) || p.category === 'modern');
    } else if (state.category === 'post_ind'){
      list = DB.poets.filter(p => (p.num >= 46 && p.num <= 70) || p.category === 'post_ind');
    } else if (state.category === 'contemporary'){
      list = DB.poets.filter(p => (p.num >= 71 && p.num <= 92) || p.category === 'contemporary');
    }

    if (!list.length){
      wrap.innerHTML = `<div class="empty">ଏହି ବିଭାଗରେ କୌଣସି କବି ନାହାନ୍ତି ।</div>`;
      return;
    }
    wrap.innerHTML = list.map((p, idx) => `
      <div class="poet" data-poet-id="${p.id}">
        <div class="pavatar" style="background:linear-gradient(135deg,${p.color || '#9C3B1B'},${p.color || '#9C3B1B'}DD)">
          ${esc(p.name.charAt(0))}
        </div>
        <div class="pbody">
          <div class="pname">
            <span class="p-num-badge">#${toOdia(p.num || idx + 1)}</span>
            ${esc(p.name)} <span class="ptitle-tag">${esc(p.title)}</span>
          </div>

          ${p.famous_book ? `
            <div>
              <span class="p-famous-badge">📖 ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ: <strong>${esc(p.famous_book)}</strong></span>
            </div>
          ` : ''}

          ${p.edition ? `
            <div class="p-edition-text" style="font-size:12px;color:var(--text);margin-top:3px">
              📚 <b>ସଂସ୍କରଣ:</b> <span>${esc(p.edition)}</span>
            </div>
          ` : ''}

          ${p.established_date ? `
            <div class="p-est-text" style="font-size:12px;color:var(--accent);margin-top:2px">
              ⏳ <b>ପ୍ରତିଷ୍ଠା କାଳ:</b> <span>${esc(p.established_date)}</span>
            </div>
          ` : ''}

          ${p.title_provider ? `
            <div class="p-provider-text">
              🎖️ ଉପାଧି ପ୍ରଦାତା: <span>${esc(p.title_provider)}</span>
            </div>
          ` : ''}

          ${p.style ? `
            <div class="p-style-text">
              ✍️ ଶୈଳୀ: <span>${esc(p.style.slice(0, 80))}...</span>
            </div>
          ` : ''}

          <div class="pmeta">${esc(p.era)} · ${toOdia(p.works ? p.works.length : 0)} ଟି କୃତି</div>
        </div>
        <div class="arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
        </div>
      </div>
    `).join('');

    $$('#poetList .poet').forEach(el => {
      el.onclick = () => openPoetWorks(el.dataset.poetId);
    });
  }

  function renderBhashaSection(){
    const box = $('#bhashaFeatures');
    if (!box) return;
    box.innerHTML = DB.bhasha_features.map((f, i) => `
      <div class="card bhasha-card">
        <div class="bhasha-num">${toOdia(i + 1)}</div>
        <div style="flex:1;min-width:0">
          <h4 style="margin:0 0 4px;font-size:14px;color:var(--primary)">${esc(f.title)}</h4>
          <p style="margin:0;font-size:12.5px;line-height:1.75;color:var(--text)">${esc(f.desc)}</p>
        </div>
      </div>
    `).join('');
  }

  /* =========================================================
     POET PROFILE & WORKS VIEW (ସ୍ରଷ୍ଟା ପରିଚୟ, ଉପାଧି, ସଂସ୍କରଣ, ପ୍ରତିଷ୍ଠା)
     ========================================================= */
  function openPoetWorks(poetId){
    state.currentPoetId = poetId;
    const p = DB.poets.find(x => x.id === poetId);
    if (!p) return;

    $('#worksPoetName').textContent = p.name;
    $('#worksCount').textContent = `#${toOdia(p.num)} · ${p.title} · ${toOdia(p.works ? p.works.length : 0)} ଟି କୃତି`;

    const wrap = $('#worksList');
    wrap.innerHTML = `
      <!-- 1. POET HERO CARD -->
      <div class="card" style="display:flex;gap:14px;align-items:center;margin-bottom:14px">
        <div class="pavatar" style="background:linear-gradient(135deg,${p.color || '#9C3B1B'},${p.color || '#9C3B1B'}DD);width:58px;height:58px;font-size:24px">
          ${esc(p.name.charAt(0))}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:18px;font-weight:700;color:var(--primary)">
            #${toOdia(p.num)} ${esc(p.name)} <span class="ptitle-tag">${esc(p.title)}</span>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">${esc(p.eng_name || '')} · ${esc(p.era)}</div>
        </div>
      </div>

      <!-- 2. UPADHI & PROVIDER BOX -->
      <div class="profile-feature-box" style="border-left:4.5px solid var(--primary)">
        <div class="pf-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
          ପ୍ରମୁଖ ଉପାଧି ଓ ଏହା କିଏ ପ୍ରଦାନ କରିଥିଲେ ?
        </div>
        <div style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:5px">
          ${esc(p.titles || p.title)}
        </div>
        <div class="pf-value">
          <b style="color:var(--accent)">ଉପାଧି ପ୍ରଦାନକାରୀ:</b> ${esc(p.title_provider || 'ଓଡ଼ିଶାର ସାରସ୍ୱତ ସମାଜ')}
        </div>
      </div>

      <!-- 3. FAMOUS BOOK BOX -->
      ${p.famous_book ? `
        <div class="profile-feature-box" style="border-left:4.5px solid var(--gold)">
          <div class="pf-title" style="color:var(--gold)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M4 19.5V6a2 2 0 0 1 2-2h11.5"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M20 17V4.5A1.5 1.5 0 0 0 18.5 3H6.5A2.5 2.5 0 0 0 4 5.5"/></svg>
            ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ / ଶ୍ରେଷ୍ଠ କାଳଜୟୀ ଗ୍ରନ୍ଥ
          </div>
          <div style="font-size:15.5px;font-weight:700;color:var(--text)">
            ${esc(p.famous_book)}
          </div>
        </div>
      ` : ''}

      <!-- 4. EDITION & ESTABLISHED DATE BOX -->
      <div class="profile-feature-box" style="border-left:4.5px solid #2B6CB0;background:rgba(43,108,176,0.06)">
        <div class="pf-title" style="color:#2B6CB0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ପ୍ରକାଶନ ସଂସ୍କରଣ ଓ ପ୍ରତିଷ୍ଠା / ଆବିର୍ଭାବ କାଳ (Edition & Established Date)
        </div>
        <div style="font-size:13.5px;color:var(--text);line-height:1.8">
          <div><b>📚 ମୁଖ୍ୟ / ପ୍ରଥମ ସଂସ୍କରଣ:</b> ${esc(p.edition || 'ଉପଲବ୍ଧ ପ୍ରାଚୀନ ତାଳପତ୍ର ପୋଥି / ପ୍ରଥମ ମୁଦ୍ରଣ')}</div>
          <div style="margin-top:3px"><b>⏳ ପ୍ରତିଷ୍ଠା କାଳ / ଆବିର୍ଭାବ:</b> ${esc(p.established_date || p.period || 'ଅଜ୍ଞାତ')}</div>
        </div>
      </div>

      <!-- 5. WRITING STYLE BOX -->
      ${p.style ? `
        <div class="profile-feature-box" style="border-left:4.5px solid var(--accent)">
          <div class="pf-title" style="color:var(--accent)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            ଲେଖନ ଶୈଳୀ ଓ ସାହିତ୍ୟିକ ବୈଶିଷ୍ଟ୍ୟ (Writing Style)
          </div>
          <div class="pf-value">
            ${esc(p.style)}
          </div>
        </div>
      ` : ''}

      <!-- 6. AWARDS BOX -->
      ${p.awards ? `
        <div class="profile-feature-box" style="border-left:4.5px solid #C4541E">
          <div class="pf-title" style="color:#C4541E">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ପୁରସ୍କାର ଓ ସମ୍ମାନାବଳୀ (Awards & Honours)
          </div>
          <div class="pf-value">
            ${Array.isArray(p.awards) ? p.awards.map(a => `<div>• ${esc(a)}</div>`).join('') : esc(p.awards)}
          </div>
        </div>
      ` : ''}

      <!-- 7. BIOGRAPHY & FAMILY DETAILS -->
      <div class="card" style="margin-bottom:14px">
        <h4 style="margin:0 0 10px;font-size:14.5px;color:var(--primary);display:flex;align-items:center;gap:6px">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          ଜୀବନ ବୃତ୍ତାନ୍ତ, ଜନ୍ମ ଓ ପରିବାର
        </h4>
        <div class="kabi-info-grid">
          ${(p.birth || p.birthplace) ? `<div class="kinfo-row"><b>ଜନ୍ମସ୍ଥାନ / ସମୟ:</b> <span>${esc(p.birth || p.birthplace)}</span></div>` : ''}
          ${p.parents ? `<div class="kinfo-row"><b>ପିତା-ମାତା / ପରିବାର:</b> <span>${esc(p.parents)}</span></div>` : ''}
        </div>
        <div style="margin-top:10px;font-size:13.5px;line-height:1.85;color:var(--text);border-top:1px dashed var(--border);padding-top:10px">
          ${esc(p.bio)}
        </div>
      </div>

      <!-- 8. ALL BOOKS / BIBLIOGRAPHY (ରଚନାବଳୀ) -->
      ${p.all_books && p.all_books.length ? `
        <div class="card" style="margin-bottom:14px">
          <h4 style="margin:0 0 9px;font-size:14px;color:var(--primary)">ସମସ୍ତ ରଚିତ ପୁସ୍ତକ ଓ ଗ୍ରନ୍ଥାବଳୀ (${toOdia(p.all_books.length)} ଟି)</h4>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${p.all_books.map(b => `<span class="book-badge">${esc(b)}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 9. SELECTED WORKS TO READ (କୃତି ସମୂହ) -->
      <h3 class="sec-title">ପାଠ୍ୟ ପୁସ୍ତକ ଓ କାଳଜୟୀ ରଚନା ସମୂହ</h3>
      ${(p.works || []).map((w, wi) => `
        <div class="work" data-work-id="${w.id || 'w-' + wi}">
          <div class="wnum">${toOdia(wi + 1)}</div>
          <div class="wbody">
            <div class="wname">${esc(w.title)}</div>
            <div class="wmeta">${esc(w.type || w.category || 'କାବ୍ୟ')} · ${esc(w.year || '')}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.5">${esc((w.desc || w.description || '').slice(0, 95))}...</div>
          </div>
          <div class="arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      `).join('')}
    `;

    $$('#worksList .work').forEach(el => {
      el.onclick = () => openWorkDetail(p.id, el.dataset.workId);
    });

    showView('works');
  }

  /* =========================================================
     WORK DETAIL VIEW (With Student Study Notes)
     ========================================================= */
  function openWorkDetail(poetId, workId){
    state.currentPoetId = poetId;
    state.currentWorkId = workId;
    const p = DB.poets.find(x => x.id === poetId);
    const w = p ? (p.works || []).find(x => (x.id === workId) || ('w-' + (p.works.indexOf(x)) === workId)) : null;
    if (!p || !w) return;

    $('#detailPoetName').textContent = p.name;
    const sc = $('#detailScroll');
    const sn = w.student_notes || {};

    sc.innerHTML = `
      <div class="detail-hero">
        <div class="dicon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5V6a2 2 0 0 1 2-2h11.5"/>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M20 17V4.5A1.5 1.5 0 0 0 18.5 3H6.5A2.5 2.5 0 0 0 4 5.5"/>
            <path d="M8 8h8M8 12h5"/>
          </svg>
        </div>
        <h2>${esc(w.title)}</h2>
        <p>${esc(p.name)} (${esc(p.title)}) · ${esc(w.type || w.category || '')} · ${esc(w.year || '')}</p>
        <button class="btn" id="readWorkBtn" style="margin-top:14px;padding:10px 24px;font-size:13.5px">
          ପଦ୍ୟ ଓ ରଚନା ପଢ଼ନ୍ତୁ (${toOdia((w.verses || []).length)} ଟି ପଦ)
        </button>
      </div>

      <div class="detail-body" style="margin-bottom:12px">
        <h3>ବିଷୟ ବସ୍ତୁ ଓ ସାରସଂକ୍ଷେପ</h3>
        <p style="font-size:13px;line-height:1.8;color:var(--text);margin:0">
          ${esc(w.desc || w.description || 'ଏହି ରଚନାଟି ଓଡ଼ିଆ ସାହିତ୍ୟର ଏକ କାଳଜୟୀ ସୃଷ୍ଟି ।')}
        </p>
      </div>

      <!-- EDITION & ESTABLISHED DETAILS -->
      <div class="profile-feature-box" style="border-left:4.5px solid #2B6CB0;background:rgba(43,108,176,0.06);margin-bottom:12px">
        <div class="pf-title" style="color:#2B6CB0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ପ୍ରକାଶନ ସଂସ୍କରଣ ଓ ପ୍ରତିଷ୍ଠା କାଳ
        </div>
        <div style="font-size:13px;line-height:1.75;color:var(--text)">
          <div><b>📚 ମୁଖ୍ୟ ସଂସ୍କରଣ:</b> ${esc(p.edition || 'ପ୍ରାଚୀନ ତାଳପତ୍ର / ପ୍ରଥମ ମୁଦ୍ରଣ')}</div>
          <div style="margin-top:3px"><b>⏳ ପ୍ରତିଷ୍ଠା କାଳ:</b> ${esc(p.established_date || p.period || 'ଅଜ୍ଞାତ')}</div>
        </div>
      </div>

      ${sn.summary ? `
        <div class="detail-body" style="margin-bottom:12px;background:var(--card);border-left:4px solid var(--accent)">
          <h3 style="color:var(--accent)">ଛାତ୍ର ସହାୟକ ଅଧ୍ୟୟନ ନୋଟ୍ସ (Student Study Notes)</h3>
          <p style="font-size:13px;line-height:1.8;color:var(--text);margin:0 0 8px">
            <b>ମୁଖ୍ୟ ବାର୍ତ୍ତା:</b> ${esc(sn.summary)}
          </p>
          ${sn.moral ? `<p style="font-size:12.5px;color:var(--primary);margin:0"><b>ନୈତିକ ଶିକ୍ଷା:</b> ${esc(sn.moral)}</p>` : ''}
          ${sn.style_feature ? `<p style="font-size:12px;color:var(--muted);margin:6px 0 0"><b>ଛନ୍ଦ ଓ ବୃତ୍ତ:</b> ${esc(sn.style_feature)}</p>` : ''}
        </div>
      ` : ''}

      <div class="detail-body" style="margin-bottom:12px">
        <h3>ସ୍ରଷ୍ଟା ପରିଚୟ ଓ ଉପାଧି</h3>
        <div style="display:flex;gap:12px;align-items:center;margin-top:6px">
          <div class="pavatar" style="background:linear-gradient(135deg,${p.color || '#9C3B1B'},${p.color || '#9C3B1B'}DD);width:48px;height:48px;font-size:18px">
            ${esc(p.name.charAt(0))}
          </div>
          <div>
            <div style="font-size:15px;font-weight:700">${esc(p.name)} (${esc(p.title)})</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">${esc(p.era)}</div>
            ${p.famous_book ? `<div style="font-size:11.5px;color:var(--gold);font-weight:600;margin-top:2px">ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ: ${esc(p.famous_book)}</div>` : ''}
          </div>
        </div>
      </div>
    `;

    $('#readWorkBtn').onclick = () => openReader(p.id, w.id || 'w-0', 0);
    showView('detail');
  }

  /* =========================================================
     ALL WORKS LIBRARY TAB
     ========================================================= */
  function renderAllWorks(){
    const wrap = $('#allWorksList');
    if (!wrap) return;
    wrap.innerHTML = DB.poets.map(p => `
      <div class="card" style="margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;cursor:pointer" data-poet-link="${p.id}">
          <div class="pavatar" style="background:linear-gradient(135deg,${p.color || '#9C3B1B'},${p.color || '#9C3B1B'}DD);width:38px;height:38px;font-size:15px">
            ${esc(p.name.charAt(0))}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:14.5px;font-weight:700;color:var(--primary)">
              #${toOdia(p.num)} ${esc(p.name)} <span style="font-size:11px;font-weight:600;color:var(--muted)">(${esc(p.title)})</span>
            </div>
            <div style="font-size:11.5px;color:var(--muted)">${toOdia((p.works || []).length)} ଟି ଗ୍ରନ୍ଥ · ${esc(p.era)}</div>
            ${p.edition ? `<div style="font-size:11px;color:var(--text);margin-top:2px">📚 ${esc(p.edition)}</div>` : ''}
          </div>
          <div class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M9 5l7 7-7 7"/></svg></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px">
          ${(p.works || []).map((w, wi) => `
            <div class="work-mini" data-poet="${p.id}" data-work="${w.id || 'w-' + wi}">
              <span class="wnum-badge">${toOdia(wi + 1)}</span>
              <span class="wmini-title">${esc(w.title)}</span>
              <span class="wmini-type">${esc((w.type || w.category || 'କୃତି').split(' ')[0])}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    $$('#allWorksList [data-poet-link]').forEach(el => {
      el.onclick = () => openPoetWorks(el.dataset.poetLink);
    });
    $$('#allWorksList .work-mini').forEach(el => {
      el.onclick = () => openWorkDetail(el.dataset.poet, el.dataset.work);
    });
  }

  /* =========================================================
     STUDENT STUDY HELPER & CHARTS (ଉପାଧି, ପ୍ରଦାତା, ଶୈଳୀ, ପୁରସ୍କାର)
     ========================================================= */
  function openStudyGuide(initialSection = 'upadhi'){
    state.studySection = initialSection;
    showView('study');
  }

  function renderStudySection(sec){
    state.studySection = sec;
    const sg = DB.student_guide || {};
    const wrap = $('#studyContent');
    if (!wrap) return;

    // Update pill highlights
    $$('#studyNavPills .study-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.sec === sec);
    });

    if (sec === 'upadhi'){
      const list = sg.upadhi_chart || [];
      wrap.innerHTML = `
        <div class="card" style="margin-bottom:12px;background:var(--primary-soft);border-color:rgba(156,59,27,.2)">
          <h3 style="margin:0 0 4px;font-size:14.5px;color:var(--primary);display:flex;align-items:center;gap:6px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:17px;height:17px"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
            ଓଡ଼ିଆ ସାହିତ୍ୟର ସମସ୍ତ ୯୨ ସ୍ରଷ୍ଟାଙ୍କ ଉପାଧି, ପ୍ରଦାତା, ସଂସ୍କରଣ ଓ ପ୍ରତିଷ୍ଠା କାଳ
          </h3>
          <p style="margin:0;font-size:12px;color:var(--text);line-height:1.6">
            ଛାତ୍ରଛାତ୍ରୀ ଏବଂ ପ୍ରତିଯୋଗିତାମୂଳକ ପରୀକ୍ଷାର୍ଥୀଙ୍କ ପାଇଁ ପ୍ରତ୍ୟେକ କବିଙ୍କ ଉପାଧି, କିଏ ପ୍ରଦାନ କରିଥିଲେ, ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ, ପ୍ରଥମ ସଂସ୍କରଣ ଓ ପ୍ରତିଷ୍ଠା କାଳ:
          </p>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px">
          ${list.map((u, i) => {
            const poetObj = DB.poets.find(x => x.id === u.id || x.name === u.name);
            const poetIdAttr = poetObj ? `data-poet-link="${poetObj.id}"` : '';
            return `
              <div class="upadhi-card" ${poetIdAttr} style="cursor:pointer">
                <div class="upadhi-card-top">
                  <div class="upadhi-author">
                    <span class="p-num-badge">#${toOdia(u.num || i + 1)}</span>
                    ${esc(u.name)}
                  </div>
                  <span class="upadhi-tag">${esc(u.upadhi)}</span>
                </div>
                <div class="upadhi-prov" style="margin-top:6px">
                  <b>🎖️ ଉପାଧି ପ୍ରଦାନକାରୀ:</b> ${esc(u.provider)}
                </div>
                <div style="font-size:12px;color:var(--text);margin-top:4px">
                  <b>📚 ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ ଓ ସଂସ୍କରଣ:</b> ${esc(u.famous_book)} <em>(${esc(u.edition)})</em>
                </div>
                <div style="font-size:12px;color:var(--accent);margin-top:3px">
                  <b>⏳ ପ୍ରତିଷ୍ଠା କାଳ:</b> ${esc(u.established_date)}
                </div>
                <div class="upadhi-meta-row" style="margin-top:5px">
                  <span style="color:var(--muted);font-style:italic">✍️ ଶୈଳୀ: ${esc(u.style)}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      $$('#studyContent [data-poet-link]').forEach(el => {
        el.onclick = () => openPoetWorks(el.dataset.poetLink);
      });

    } else if (sec === 'styles'){
      const list = sg.writing_styles || [];
      wrap.innerHTML = `
        <div class="card" style="margin-bottom:12px;background:var(--accent-soft);border-color:rgba(31,110,92,.2)">
          <h3 style="margin:0 0 4px;font-size:14.5px;color:var(--accent);display:flex;align-items:center;gap:6px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:17px;height:17px"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            ଓଡ଼ିଆ କାବ୍ୟ ଓ ସାହିତ୍ୟର ବିଭିନ୍ନ ଲେଖନ ଶୈଳୀ (Writing Styles Directory)
          </h3>
          <p style="margin:0;font-size:12px;color:var(--text);line-height:1.6">
            ପ୍ରାଚୀନ ଦାଣ୍ଡି ବୃତ୍ତରୁ ଆଧୁନିକ ମୁକ୍ତଛନ୍ଦ ଯାଏଁ ସମସ୍ତ ସାହିତ୍ୟିକ ଶୈଳୀର ପ୍ରାମାଣିକ ବର୍ଣ୍ଣନା:
          </p>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px">
          ${list.map(s => `
            <div class="style-card">
              <div class="stitle">${esc(s.title)}</div>
              <div class="sauthor">ପ୍ରମୁଖ ପ୍ରୟୋଗକର୍ତ୍ତା: <span>${esc(s.author)}</span></div>
              <p class="sdesc">${esc(s.desc)}</p>
            </div>
          `).join('')}
        </div>
      `;

    } else if (sec === 'awards'){
      const list = sg.awards_directory || [];
      wrap.innerHTML = `
        <div class="card" style="margin-bottom:12px;background:rgba(217,119,6,.08);border-color:rgba(217,119,6,.25)">
          <h3 style="margin:0 0 4px;font-size:14.5px;color:var(--gold);display:flex;align-items:center;gap:6px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:17px;height:17px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ଓଡ଼ିଶାର ସ୍ରଷ୍ଟାମାନଙ୍କୁ ପ୍ରଦତ୍ତ ରାଷ୍ଟ୍ରୀୟ ଓ ରାଜ୍ୟ ସାହିତ୍ୟ ପୁରସ୍କାର
          </h3>
          <p style="margin:0;font-size:12px;color:var(--text);line-height:1.6">
            ଜ୍ଞାନପୀଠ, ସରସ୍ୱତୀ ସମ୍ମାନ, ପଦ୍ମ ପୁରସ୍କାର ଓ ସାହିତ୍ୟ ଏକାଡେମୀ ସମ୍ମାନର ତାଲିକା:
          </p>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px">
          ${list.map(a => `
            <div class="card" style="border-left:4px solid var(--gold)">
              <h4 style="margin:0 0 6px;font-size:14.5px;color:var(--gold)">${esc(a.award)}</h4>
              <p style="margin:0 0 8px;font-size:12.5px;line-height:1.6;color:var(--text)">${esc(a.desc)}</p>
              ${a.recipients ? `
                <div style="display:flex;flex-direction:column;gap:4px">
                  ${a.recipients.map(r => `<div style="font-size:12.5px;color:var(--primary);font-weight:600">• ${esc(r)}</div>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;

    } else if (sec === 'qa'){
      const list = sg.exam_qa || [];
      wrap.innerHTML = `
        <div class="card" style="margin-bottom:12px">
          <h3 style="margin:0 0 10px;font-size:15px;color:var(--primary);display:flex;align-items:center;gap:6px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>
            ପରୀକ୍ଷା ଉପଯୋଗୀ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପ୍ରଶ୍ନୋତ୍ତର (Q&A)
          </h3>
          <div class="qa-list">
            ${list.map((qa, i) => `
              <div class="qa-item">
                <div class="qa-q"><b>ପ୍ର. ${toOdia(i + 1)}:</b> ${esc(qa.q)}</div>
                <div class="qa-a"><b>ଉତ୍ତର:</b> ${esc(qa.a)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    } else if (sec === 'glossary'){
      const list = sg.glossary || [];
      wrap.innerHTML = `
        <div class="card" style="margin-bottom:12px">
          <h3 style="margin:0 0 10px;font-size:15px;color:var(--primary);display:flex;align-items:center;gap:6px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            ପ୍ରାଚୀନ ଓ କାବ୍ୟିକ ଶବ୍ଦାର୍ଥ କୋଷ (Glossary)
          </h3>
          <p style="font-size:12.5px;color:var(--muted);margin:0 0 12px">କବିତା ଓ ପ୍ରାଚୀନ କାବ୍ୟରେ ବ୍ୟବହୃତ କଠିନ ଶବ୍ଦଗୁଡ଼ିକର ସରଳ ଅର୍ଥ:</p>
          <div class="glossary-grid">
            ${list.map(g => `
              <div class="glossary-item">
                <span class="gword">${esc(g.word)}</span>
                <span class="gmean">${esc(g.meaning || g.mean)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  /* =========================================================
     READER VIEW (With Verse Meanings & Student Mode)
     ========================================================= */
  function verseDisplay(v){
    if (v.lines){
      return esc(v.lines).replace(/\n/g, '<br>');
    }
    if (settings.style === 'two'){
      const a = (v.a || '').replace(/।।\s*$/, '').trim();
      const b = (v.b || '').replace(/।।\s*$/, '').trim();
      return `${esc(a)} <span class="sep">||</span> ${esc(b)} <span class="sep">||</span>`;
    }
    return esc(((v.a || '') + ' ' + (v.b || '')).trim());
  }

  function isBookmarked(poetId, workId, vi){
    return bookmarks.some(b => b.poetId === poetId && b.workId === workId && b.verseIdx === vi);
  }

  function openReader(poetId, workId, verseIdx){
    const p = DB.poets.find(x => x.id === poetId);
    const w = p ? (p.works || []).find(x => (x.id === workId) || ('w-' + (p.works.indexOf(x)) === workId)) : null;
    if (!p || !w) return;

    state.currentPoetId = poetId;
    state.currentWorkId = workId;
    state.currentVerseIdx = verseIdx || 0;

    const verses = w.verses || [];

    $('#readerChapTitle').textContent = w.title;
    $('#readerChapNo').textContent = `${p.name} · ${(w.type || w.category || 'କୃତି').split(' ')[0]}`;
    $('#chEyebrow').textContent = `${p.name} (${p.title}) · ${w.year || ''}`;
    $('#chTitle').textContent = w.title;
    $('#chMeta').textContent = `ସମୁଦାୟ ${toOdia(verses.length)} ପଦ / ଧାଡ଼ି`;

    const workIdx = p.works.indexOf(w);
    $('#chapProgress').textContent = `କୃତି ${toOdia(workIdx + 1)} / ${toOdia(p.works.length)}`;
    $('#prevChap').disabled = workIdx <= 0;
    $('#nextChap').disabled = workIdx >= p.works.length - 1;

    const vl = $('#verseList');
    vl.innerHTML = verses.map((v, i) => {
      const bm = isBookmarked(poetId, workId, i) ? ' bm' : '';
      return `
        <div class="verse${bm}" data-i="${i}">
          <span class="vn">${toOdia(i + 1)}</span>
          <span class="vtext">${verseDisplay(v)}</span>
          ${(v.meaning || v.m) ? `<div class="verse-meaning"><b>ଭାବାର୍ଥ:</b> ${esc(v.meaning || v.m)}</div>` : ''}
        </div>
      `;
    }).join('');

    $$('#verseList .verse').forEach(el => {
      el.onclick = () => {
        const vi = +el.dataset.i;
        openSheet(poetId, workId, vi);
      };
    });

    resume = { poetId, workId, verseIdx: state.currentVerseIdx, time: Date.now() };
    saveResume();

    showView('reader');

    if (verseIdx > 0){
      setTimeout(() => {
        const target = $(`#verseList .verse[data-i="${verseIdx}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  /* =========================================================
     BOTTOM ACTION SHEET (Bookmark, Copy, Share)
     ========================================================= */
  let sheetData = null;
  function openSheet(poetId, workId, vi){
    const p = DB.poets.find(x => x.id === poetId);
    const w = p ? (p.works || []).find(x => (x.id === workId) || ('w-' + (p.works.indexOf(x)) === workId)) : null;
    const v = w ? (w.verses || [])[vi] : null;
    if (!p || !w || !v) return;

    sheetData = { poetId, workId, verseIdx: vi, p, w, v };

    const plain = (v.lines || `${v.a || ''} ।। ${v.b || ''}`).trim();
    $('#sheetVerse').textContent = plain;

    const bm = isBookmarked(poetId, workId, vi);
    $('#sheetBmLabel').textContent = bm ? 'ବୁକମାର୍କରୁ ହଟାନ୍ତୁ' : 'ବୁକମାର୍କ ଯୋଡ଼ନ୍ତୁ';

    $('#sheetBackdrop').classList.add('show');
    $('#sheet').classList.add('show');
  }

  function closeSheet(){
    $('#sheetBackdrop').classList.remove('show');
    $('#sheet').classList.remove('show');
  }

  /* =========================================================
     SEARCH VIEW (Index Upadhi, Provider, Famous Book, Edition, Dates)
     ========================================================= */
  let searchIndex = null;
  function buildSearchIndex(){
    if (searchIndex) return searchIndex;
    const idx = [];
    DB.poets.forEach(p => {
      const awardsStr = Array.isArray(p.awards) ? p.awards.join(' ') : (p.awards || '');
      const bioText = `${p.num || ''} ${p.name} ${p.eng_name || ''} ${p.title} ${p.title_provider || ''} ${p.famous_book || ''} ${p.edition || ''} ${p.established_date || ''} ${p.style || ''} ${p.era} ${p.birth || p.birthplace || ''} ${p.parents || ''} ${p.titles || ''} ${awardsStr} ${p.bio || ''} ${(p.all_books || []).join(' ')}`;
      idx.push({
        type: 'poet',
        poetId: p.id,
        title: `#${toOdia(p.num)} ${p.name}`,
        meta: `${p.title} · ${p.era} ${p.famous_book ? '· 📖 ' + p.famous_book : ''} ${p.edition ? '· 📚 ' + p.edition : ''}`,
        text: bioText,
        lower: bioText.toLowerCase()
      });
      if (p.works){
        p.works.forEach((w, wi) => {
          const wtext = `${w.title} ${w.type || w.category || ''} ${w.year || ''} ${w.desc || w.description || ''} ${(w.parts || []).join(' ')} ${w.student_notes ? w.student_notes.summary + ' ' + w.student_notes.moral : ''}`;
          idx.push({
            type: 'work',
            poetId: p.id,
            workId: w.id || 'w-' + wi,
            title: w.title,
            meta: `${p.name} · ${w.type || w.category || 'କୃତି'}`,
            text: wtext,
            lower: wtext.toLowerCase()
          });
          if (w.verses){
            w.verses.forEach((v, vi) => {
              const vtext = `${v.lines || (v.a + ' ' + v.b)} ${v.meaning || v.m || ''}`.trim();
              idx.push({
                type: 'verse',
                poetId: p.id,
                workId: w.id || 'w-' + wi,
                verseIdx: vi,
                title: `${w.title} · ପଦ ${toOdia(vi + 1)}`,
                meta: `${p.name} (${p.title})`,
                text: vtext,
                lower: vtext.toLowerCase()
              });
            });
          }
        });
      }
    });
    searchIndex = idx;
    return idx;
  }

  function renderSearch(){
    const q = ($('#searchInput').value || '').trim().toLowerCase();
    const box = $('#searchResults');

    if (!q){
      box.innerHTML = `
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
          <div>କବି, ଉପାଧି, ପ୍ରସିଦ୍ଧ ପୁସ୍ତକ, ସଂସ୍କରଣ, ପ୍ରତିଷ୍ଠା କାଳ ବା ପଦ ଖୋଜନ୍ତୁ</div>
          <div style="font-size:12px;margin-top:6px;color:var(--muted)">ଉଦାହରଣ: "କବିବର", "ବ୍ୟାସକବି", "ଛମାଣ ଆଠଗୁଣ୍ଠ", "୧୮୯୭", "ଦାଣ୍ଡି ବୃତ୍ତ", "ବାମଣ୍ଡା"</div>
        </div>`;
      return;
    }

    const idx = buildSearchIndex();
    const hits = idx.filter(x => x.lower.includes(q)).slice(0, 95);

    if (!hits.length){
      box.innerHTML = `<div class="empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
        <div>କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ</div>
        <div style="font-size:12px;margin-top:4px">ଅନ୍ୟ ଓଡ଼ିଆ ଶବ୍ଦରେ ଚେଷ୍ଟା କରନ୍ତୁ</div>
      </div>`;
      return;
    }

    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');

    box.innerHTML = hits.map(h => {
      const safe = esc(h.text.slice(0, 115));
      const marked = safe.replace(re, '<mark>$1</mark>');
      return `<div class="sr" data-type="${h.type}" data-poet="${h.poetId}" data-work="${h.workId || ''}" data-verse="${h.verseIdx !== undefined ? h.verseIdx : ''}">
        <div class="loc">${esc(h.meta)}</div>
        <div class="txt"><b>${esc(h.title)}</b> — ${marked}</div>
      </div>`;
    }).join('');

    $$('#searchResults .sr').forEach(el => {
      el.onclick = () => {
        const type = el.dataset.type;
        const pid = el.dataset.poet;
        const wid = el.dataset.work;
        const vi = el.dataset.verse ? +el.dataset.verse : 0;
        if (type === 'poet'){
          openPoetWorks(pid);
        } else if (type === 'work'){
          openWorkDetail(pid, wid);
        } else {
          openReader(pid, wid, vi);
        }
      };
    });
  }

  /* =========================================================
     BOOKMARKS VIEW
     ========================================================= */
  function renderBookmarks(){
    const box = $('#bmList');
    if (!bookmarks.length){
      box.innerHTML = `
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h12v17l-6-4.2-6 4.2z"/></svg>
          <div>କୌଣସି ବୁକମାର୍କ ସଂରକ୍ଷିତ ନାହିଁ</div>
          <div style="font-size:12px;margin-top:4px">ପଠନ ବେଳେ ଯେକୌଣସି ପଦ ଉପରେ କ୍ଲିକ୍ କରି ବୁକମାର୍କ ଯୋଡ଼ନ୍ତୁ</div>
        </div>`;
      return;
    }

    box.innerHTML = bookmarks.map((b, i) => `
      <div class="bm-card">
        <div class="loc">
          <span>${esc(b.poetName)} (${esc(b.poetTitle)}) · ${esc(b.workTitle)}</span>
          <span style="color:var(--primary);font-weight:700">ପଦ ${toOdia(b.verseIdx + 1)}</span>
        </div>
        <div class="txt">${esc(b.verseText)}</div>
        <div class="bm-acts">
          <button class="btn ghost" data-del-bm="${i}">ହଟାନ୍ତୁ</button>
          <button class="btn" data-go-bm="${i}">ପଢ଼ନ୍ତୁ</button>
        </div>
      </div>
    `).join('');

    $$('#bmList [data-del-bm]').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.delBm;
        bookmarks.splice(idx, 1);
        saveBookmarks();
        renderBookmarks();
        toast('ବୁକମାର୍କ ହଟାଗଲା');
      };
    });

    $$('#bmList [data-go-bm]').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.goBm;
        const b = bookmarks[idx];
        if (b) openReader(b.poetId, b.workId, b.verseIdx);
      };
    });
  }

  /* =========================================================
     SETTINGS APPLY & BINDINGS
     ========================================================= */
  function applySettings(){
    document.body.className = settings.theme === 'dark' ? 'dark' : settings.theme === 'sepia' ? 'sepia' : '';
    document.documentElement.style.setProperty('--reader-font-size', `${settings.fontSize}px`);
    document.documentElement.style.setProperty('--reader-line-height', `${settings.lineHeight}`);

    $$('#themeSeg button').forEach(b => b.classList.toggle('active', b.dataset.theme === settings.theme));
    $$('#fontSeg button').forEach(b => b.classList.toggle('active', +b.dataset.f === settings.fontSize));
    $$('#lineSeg button').forEach(b => b.classList.toggle('active', +b.dataset.l === settings.lineHeight));
    $$('#styleSeg button').forEach(b => b.classList.toggle('active', b.dataset.s === settings.style));
  }

  /* =========================================================
     EVENT LISTENERS & APP BOOT
     ========================================================= */
  function initEvents(){
    // Header Back Buttons (Support all view headers safely)
    const wb = $('#worksBack') || $('#backFromWorks');
    if (wb) wb.onclick = goBack;
    const db = $('#detailBack') || $('#backFromDetail');
    if (db) db.onclick = goBack;
    const studyBackBtn = $('#studyBack') || $('#backFromStudy');
    if (studyBackBtn) studyBackBtn.onclick = goBack;
    const rb = $('#readerBack') || $('#backFromReader');
    if (rb) rb.onclick = goBack;

    // Top Theme button
    const topThemeBtn = $('#topThemeBtn');
    if (topThemeBtn){
      topThemeBtn.onclick = () => {
        settings.theme = settings.theme === 'dark' ? 'light' : settings.theme === 'light' ? 'sepia' : 'dark';
        saveSettings();
        applySettings();
      };
    }

    // Quick action buttons in hero
    $$('.qbtn[data-act]').forEach(btn => {
      btn.onclick = () => {
        const act = btn.dataset.act;
        if (act === 'start') {
          const firstP = DB.poets[0];
          const firstW = firstP && firstP.works ? firstP.works[0] : null;
          if (firstP && firstW) openReader(firstP.id, firstW.id || 'w-0', 0);
        } else if (act === 'upadhi') {
          openStudyGuide('upadhi');
        } else if (act === 'styles') {
          openStudyGuide('styles');
        } else if (act === 'study') {
          openStudyGuide('qa');
        }
      };
    });

    // Bottom Navigation
    $$('.tabbar button').forEach(b => {
      b.onclick = () => {
        const tab = b.dataset.tab;
        if (tab === 'home') showView('home');
        else if (tab === 'works') showView('works-all');
        else if (tab === 'study') showView('study');
        else if (tab === 'search') showView('search');
        else if (tab === 'bm') showView('bm');
        else if (tab === 'settings') showView('settings');
      };
    });

    // Quick Action Study buttons
    const btnUpadhi = $('#btnStudyUpadhi');
    if (btnUpadhi) btnUpadhi.onclick = () => openStudyGuide('upadhi');
    const btnStyles = $('#btnStudyStyles');
    if (btnStyles) btnStyles.onclick = () => openStudyGuide('styles');
    const btnAwards = $('#btnStudyAwards');
    if (btnAwards) btnAwards.onclick = () => openStudyGuide('awards');

    // Study Nav Pills
    $$('#studyNavPills .study-pill').forEach(b => {
      b.onclick = () => renderStudySection(b.dataset.sec);
    });

    // Search input
    const si = $('#searchInput');
    if (si){
      si.oninput = () => renderSearch();
    }
    const sb = $('#searchBtn');
    if (sb){
      sb.onclick = () => renderSearch();
    }

    // Reader controls
    const prevChap = $('#prevChap');
    if (prevChap){
      prevChap.onclick = () => {
        const p = DB.poets.find(x => x.id === state.currentPoetId);
        if (!p) return;
        const curIdx = p.works.findIndex(x => (x.id === state.currentWorkId) || ('w-' + p.works.indexOf(x) === state.currentWorkId));
        if (curIdx > 0) openReader(p.id, p.works[curIdx - 1].id || 'w-' + (curIdx - 1), 0);
      };
    }

    const nextChap = $('#nextChap');
    if (nextChap){
      nextChap.onclick = () => {
        const p = DB.poets.find(x => x.id === state.currentPoetId);
        if (!p) return;
        const curIdx = p.works.findIndex(x => (x.id === state.currentWorkId) || ('w-' + p.works.indexOf(x) === state.currentWorkId));
        if (curIdx < p.works.length - 1) openReader(p.id, p.works[curIdx + 1].id || 'w-' + (curIdx + 1), 0);
      };
    }

    const readerFont = $('#readerFont');
    const fontbar = $('#fontbar');
    if (readerFont && fontbar){
      readerFont.onclick = () => fontbar.classList.toggle('show');
    }

    const readerSettingsBtn = $('#readerSettingsBtn');
    if (readerSettingsBtn){
      readerSettingsBtn.onclick = () => showView('settings');
    }

    const fsMinus = $('#fsMinus');
    if (fsMinus){
      fsMinus.onclick = () => {
        if (settings.fontSize > 14){
          settings.fontSize -= 1;
          saveSettings();
          applySettings();
        }
      };
    }

    const fsPlus = $('#fsPlus');
    if (fsPlus){
      fsPlus.onclick = () => {
        if (settings.fontSize < 30){
          settings.fontSize += 1;
          saveSettings();
          applySettings();
        }
      };
    }

    const fsRange = $('#fsRange');
    if (fsRange){
      fsRange.value = settings.fontSize;
      fsRange.oninput = () => {
        settings.fontSize = +fsRange.value;
        saveSettings();
        applySettings();
      };
    }

    const styleToggle = $('#styleToggle');
    if (styleToggle){
      styleToggle.onclick = () => {
        settings.style = settings.style === 'two' ? 'line' : 'two';
        saveSettings();
        applySettings();
        if (state.activeView === 'reader'){
          openReader(state.currentPoetId, state.currentWorkId, state.currentVerseIdx);
        }
      };
    }

    // Bottom Action Sheet buttons
    const sheetBackdrop = $('#sheetBackdrop');
    if (sheetBackdrop) sheetBackdrop.onclick = closeSheet;

    const sheetBookmark = $('#sheetBookmark');
    if (sheetBookmark) {
      sheetBookmark.onclick = () => {
        if (!sheetData) return;
        const { poetId, workId, verseIdx, p, w, v } = sheetData;
        const idx = bookmarks.findIndex(b => b.poetId === poetId && b.workId === workId && b.verseIdx === verseIdx);
        if (idx >= 0){
          bookmarks.splice(idx, 1);
          toast('ବୁକମାର୍କ ହଟାଗଲା');
        } else {
          bookmarks.push({
            poetId,
            workId,
            verseIdx,
            poetName: p.name,
            poetTitle: p.title,
            workTitle: w.title,
            verseText: (v.lines || `${v.a || ''} ।। ${v.b || ''}`).trim(),
            time: Date.now()
          });
          toast('ବୁକମାର୍କ ଯୋଡ଼ାଗଲା');
        }
        saveBookmarks();
        closeSheet();
        // Update reader class
        const row = $(`#verseList .verse[data-i="${verseIdx}"]`);
        if (row) row.classList.toggle('bm', idx < 0);
      };
    }

    const sheetCopy = $('#sheetCopy');
    if (sheetCopy) {
      sheetCopy.onclick = () => {
        if (!sheetData) return;
        const { p, w, v, verseIdx } = sheetData;
        const plain = `${v.lines || (v.a + ' ।। ' + v.b)}\n— ${w.title} (ପଦ ${toOdia(verseIdx + 1)}), ${p.name} (${p.title})`;
        if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(plain).then(() => {
            toast('ପଦ କପି ହୋଇଗଲା !');
          });
        } else {
          toast('କପି ହୋଇଗଲା !');
        }
        closeSheet();
      };
    }

    const sheetShare = $('#sheetShare');
    if (sheetShare) {
      sheetShare.onclick = () => {
        if (!sheetData) return;
        const { p, w, v, verseIdx } = sheetData;
        const plain = `${v.lines || (v.a + ' ।। ' + v.b)}\n— ${w.title} (ପଦ ${toOdia(verseIdx + 1)}), ${p.name} (${p.title})`;
        if (navigator.share){
          navigator.share({ title: w.title, text: plain }).catch(() => {});
        } else if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(plain).then(() => toast('ପଦ କପି ହୋଇଗଲା (ବାଣ୍ଟିପାରିବେ) !'));
        }
        closeSheet();
      };
    }

    // Settings segment buttons
    $$('#themeSeg button').forEach(b => {
      b.onclick = () => {
        settings.theme = b.dataset.theme;
        saveSettings();
        applySettings();
      };
    });

    $$('#fontSeg button').forEach(b => {
      b.onclick = () => {
        settings.fontSize = +b.dataset.f;
        saveSettings();
        applySettings();
      };
    });

    $$('#lineSeg button').forEach(b => {
      b.onclick = () => {
        settings.lineHeight = +b.dataset.l;
        saveSettings();
        applySettings();
      };
    });

    $$('#styleSeg button').forEach(b => {
      b.onclick = () => {
        settings.style = b.dataset.s;
        saveSettings();
        applySettings();
        if (state.activeView === 'reader'){
          openReader(state.currentPoetId, state.currentWorkId, state.currentVerseIdx);
        }
      };
    });

    const resetBtn = $('#resetAll');
    if (resetBtn){
      resetBtn.onclick = () => {
        localStorage.removeItem(STORAGE.SETTINGS);
        localStorage.removeItem(STORAGE.BOOKMARKS);
        localStorage.removeItem(STORAGE.RESUME);
        settings = { theme: 'light', fontSize: 19, lineHeight: 1.95, style: 'two' };
        bookmarks = [];
        resume = null;
        applySettings();
        renderHome();
        toast('ସମସ୍ତ ସେଟିଂସ ରିସେଟ୍ ହେଲା');
      };
    }
  }

  /* ============ INITIALIZATION ============ */
  function init(){
    loadStorage();
    applySettings();
    initEvents();
    renderHome();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
