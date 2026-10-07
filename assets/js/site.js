/* Parvaan Ahluwalia — portfolio interactions
   Motion is skipped entirely for visitors who prefer reduced motion. */
(function(){
  const root = document.documentElement;
  root.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) root.classList.add('reduced');
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

  /* ---------- Nav: solid after scrolling ---------- */
  const nav = $('.nav');
  const navCheck = () => nav && nav.classList.toggle('is-solid', window.scrollY > 40);

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- SVG draw-in: measure path lengths ---------- */
  $$('.draw').forEach(svg => {
    $$('.s,.a,.s2', svg).forEach(p => {
      try { const L = Math.ceil(p.getTotalLength() * 3); p.style.setProperty('--len', L); } catch(e){}
    });
  });

  /* ---------- Reveal + draw on intersection ---------- */
  const targets = $$('.reveal, .draw');
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('in','is-drawn','done'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting){ const t = e.target; t.classList.add('in','is-drawn'); io.unobserve(t);
          if (t.classList.contains('draw')) setTimeout(() => t.classList.add('done'), 2200); }
      });
    }, { threshold: .06, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(t => io.observe(t));
  }

  /* ---------- Count-up stats ---------- */
  const counters = $$('[data-count]');
  const runCount = el => {
    const end = +el.dataset.count, pad = el.dataset.pad ? +el.dataset.pad : 2;
    if (reduced){ el.textContent = String(end).padStart(pad,'0'); return; }
    const t0 = performance.now(), dur = 1100;
    const step = t => {
      const k = Math.min(1,(t - t0)/dur), v = Math.round(end * (1 - Math.pow(1-k,3)));
      el.textContent = String(v).padStart(pad,'0');
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window){
    const co = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ runCount(e.target); co.unobserve(e.target);} }), {threshold:.6});
    counters.forEach(c => co.observe(c));
  } else counters.forEach(runCount);

  /* ---------- Hero: rotating verb ---------- */
  const word = $('#heroWord');
  if (word && !reduced){
    const words = (word.dataset.words || '').split(',');
    let wi = 0, ci = words[0].length, deleting = false;
    const tick = () => {
      const w = words[wi];
      if (!deleting){
        ci++;
        if (ci > w.length){ deleting = true; return setTimeout(tick, 1900); }
      } else {
        ci--;
        if (ci === 0){ deleting = false; wi = (wi+1) % words.length; return setTimeout(tick, 250); }
      }
      word.textContent = words[wi].slice(0, ci);
      setTimeout(tick, deleting ? 45 : 85);
    };
    setTimeout(() => { deleting = true; tick(); }, 2600);
  }

  /* ---------- Hero: crosshair + coordinate readout (hero only) ---------- */
  const hero = $('#hero');
  const cross = $('#crosshair');
  const coord = $('#coord');
  if (hero && cross && !reduced && window.matchMedia('(pointer:fine)').matches){
    hero.classList.add('has-crosshair');
    hero.addEventListener('mousemove', e => {
      cross.style.left = e.clientX + 'px'; cross.style.top = e.clientY + 'px';
      cross.classList.add('on');
      if (coord) coord.textContent = `X ${String(e.clientX).padStart(4,'0')}  Y ${String(e.clientY).padStart(4,'0')}`;
    });
    hero.addEventListener('mouseleave', () => cross.classList.remove('on'));
    $$('a, button', hero).forEach(a => {
      a.addEventListener('mouseenter', () => cross.classList.remove('on'));
      a.addEventListener('mouseleave', () => cross.classList.add('on'));
    });
  }

  /* ---------- Hero parallax ---------- */
  const bpMinor = $('#bpMinor'), bpMajor = $('#bpMajor'), heroContent = $('#heroContent'), gear = $('#heroGear');
  const dims = $$('.dim-line');
  function heroParallax(){
    if (!hero || reduced) return;
    const r = hero.getBoundingClientRect();
    const p = Math.min(Math.max(-r.top / window.innerHeight, 0), 1);
    if (bpMinor) bpMinor.style.transform = `translateY(${p*60}px)`;
    if (bpMajor) bpMajor.style.transform = `translateY(${p*30}px)`;
    if (heroContent){ heroContent.style.transform = `translateY(${p*-80}px)`; heroContent.style.opacity = 1 - p*1.15; }
    if (gear) gear.style.transform = `translate(-50%,-50%) rotate(${p*40}deg) scale(${1+p*.15})`;
    dims.forEach((d,i) => { d.style.transform = `translateY(${p*(40+i*18)}px)`; d.style.opacity = .55*(1-p); });
    const sy = $('#scrollY'); if (sy) sy.textContent = String(Math.round(window.scrollY)).padStart(5,'0');
  }

  /* ---------- Horizontal project rail (his original idea) ---------- */
  const railWrap = $('#railWrap'), railTrack = $('#railTrack'), railFill = $('#railFill'), railCounter = $('#railCounter');
  const cards = railTrack ? $$('.card', railTrack).length : 0;
  if (railWrap) railWrap.style.setProperty('--cards', cards);
  function rail(){
    if (!railWrap || reduced || window.innerWidth <= 860) return;
    const r = railWrap.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const p = Math.min(Math.max(-r.top / total, 0), 1);
    const max = railTrack.scrollWidth - window.innerWidth;
    railTrack.style.transform = `translateX(${-p*max}px)`;
    if (railFill) railFill.style.width = `${p*100}%`;
    if (railCounter){
      const cur = Math.min(cards, Math.floor(p*cards) + 1);
      railCounter.innerHTML = `<span class="accent">${String(cur).padStart(2,'0')}</span> / ${String(cards).padStart(2,'0')}`;
    }
  }

  /* ---------- Project page: TOC highlighting ---------- */
  const tocLinks = $$('.p-toc a[href^="#"]');
  const sections = tocLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  function toc(){
    if (!sections.length) return;
    let cur = sections[0];
    sections.forEach(s => { if (s.getBoundingClientRect().top < window.innerHeight * .35) cur = s; });
    tocLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur.id));
  }

  /* ---------- Copy link ---------- */
  const toast = $('.toast');
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const url = b.dataset.copy || location.href;
    try { await navigator.clipboard.writeText(url); } catch(e){
      const t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch(_){} t.remove();
    }
    if (toast){ toast.textContent = 'Link copied'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1600); }
  }));

  /* ---------- Scroll loop (rAF-throttled) ---------- */
  let ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { navCheck(); heroParallax(); rail(); toc(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();
})();
