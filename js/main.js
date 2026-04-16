/* =========================================
   CORE UI & INITIALIZATION
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  renderPublicPage();
  buildDateGrid();
  setupScrollEffects();
  setupNavbar();
  initHeroCanvas();
  initHeroLetters(appData.name);
  initCounters();
});

/* =========================================
   THEME
   ========================================= */
function applyTheme() {
  const r = document.documentElement.style;
  const c = appData.colors;
  r.setProperty('--primary', c.primary);
  r.setProperty('--primary-dark', darkenColor(c.primary, 20));
  r.setProperty('--primary-light', lightenColor(c.primary, 20));
  r.setProperty('--bg', c.bg);
  r.setProperty('--secondary', adjustColor(c.secondary, -10));
  r.setProperty('--secondary-light', adjustColor(c.secondary, 5));
  r.setProperty('--bg-card', adjustColor(c.bg, 8));
  r.setProperty('--bg-card2', adjustColor(c.bg, 14));
  r.setProperty('--text', c.text);
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? [parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16)] : [0,0,0];
}
function rgbToHex(r,g,b){return'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('')}
function darkenColor(hex,p){const[r,g,b]=hexToRgb(hex);return rgbToHex(r-p,g-p,b-p)}
function lightenColor(hex,p){const[r,g,b]=hexToRgb(hex);return rgbToHex(r+p,g+p,b+p)}
function adjustColor(hex,p){const[r,g,b]=hexToRgb(hex);return rgbToHex(r+p,g+p,b+p)}

/* =========================================
   RENDER PUBLIC PAGE
   ========================================= */
function renderPublicPage() {
  const n = appData.name;
  const biz = BIZ_TYPES[appData.biztype] || BIZ_TYPES.otro;

  // Brand & meta
  document.getElementById('page-title').textContent = n + ' — ' + appData.tagline;
  document.getElementById('nav-brand-name').textContent = n;
  document.getElementById('nav-logo-icon').textContent = biz.icon;
  document.getElementById('hero-tagline').textContent = appData.tagline;
  document.getElementById('hero-badge-text').textContent = biz.badge;
  document.getElementById('footer-name').textContent = n;
  document.getElementById('footer-tagline').textContent = appData.tagline;
  document.getElementById('footer-copy-name').textContent = n;

  // Section labels based on biz type
  const teamTag = document.getElementById('team-tag');
  const teamTitle = document.getElementById('team-title');
  if(teamTag) teamTag.textContent = '👑 El equipo';
  if(teamTitle) teamTitle.innerHTML = `Nuestros <span class="gold">${biz.team}</span>`;
  const bookBar = document.getElementById('booking-barber-label');
  if(bookBar) bookBar.textContent = `Elige tu ${biz.pro}`;

  // Re-animate name
  initHeroLetters(n);

  // Shop WhatsApp
  const wa = `https://wa.me/${appData.whatsapp}?text=${encodeURIComponent('Hola '+n+'! Quisiera más información.')}`;
  document.getElementById('wa-float').href = wa;
  document.getElementById('shop-wa-btn').href = wa;

  // Components
  renderServices();
  renderBarbers();
  renderHours();
  renderLocation();
  renderSocials();
  renderBookingOptions();
}

function renderServices() {
  const el = document.getElementById('services-grid');
  el.innerHTML = appData.services.map((s,i) => `
    <div class="service-card reveal" style="transition-delay:${i*0.07}s">
      <div class="service-card-num">${String(i+1).padStart(2,'0')}</div>
      ${s.photo ? `<div class="service-card-img"><img src="${s.photo}" alt="${s.name}"></div>` : `<span class="service-icon">${s.icon}</span>`}
      <div class="service-name">${s.name}</div>
      <div class="service-divider"></div>
      <div class="service-duration">⏱ ${s.duration} min</div>
      <div class="service-price">$${Number(s.price).toLocaleString()}</div>
    </div>
  `).join('');
  reObserve();
}

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

function renderBarbers() {
  const el = document.getElementById('barbers-grid');
  const biz = BIZ_TYPES[appData.biztype] || BIZ_TYPES.otro;
  el.innerHTML = appData.barbers.map((b,i) => `
    <div class="barber-card reveal" style="transition-delay:${i*0.1}s">
      <div class="barber-photo">
        ${b.photo ? `<img src="${b.photo}" alt="${b.name}" class="barber-photo-img">` : `<div class="barber-photo-placeholder">${biz.icon}</div>`}
        <div class="barber-photo-overlay"></div>
        <div class="barber-name-overlay">
          <div class="barber-name">${b.name}</div>
          <div class="barber-specialty">${b.specialty}</div>
        </div>
        <div class="barber-badge">${biz.pro}</div>
      </div>
      <div class="barber-info">
        <a href="https://wa.me/${b.whatsapp}?text=${encodeURIComponent('Hola '+b.name+'! Quisiera reservar una cita.')}" target="_blank" class="barber-whatsapp">
          ${WA_SVG} Contactar por WhatsApp
        </a>
      </div>
    </div>
  `).join('');
  reObserve();
}

function renderHours() {
  const el = document.getElementById('hours-display');
  const days = Object.entries(appData.hours);
  el.innerHTML = days.map(([day,h]) => `
    <li class="hours-row">
      <span class="hours-day">${day}</span>
      ${h.closed ? '<span class="hours-closed">Cerrado</span>' : `<span>${h.open} – ${h.close}</span>`}
    </li>
  `).join('');
}

function renderLocation() {
  const loc = appData.location;
  document.getElementById('address-display').textContent = loc.address + (loc.city ? '\n' + loc.city : '');
  document.getElementById('maps-link').href = loc.maps || '#';
}

function renderSocials() {
  const s = appData.socials;
  const items = [
    { key:'instagram', icon:'📸', label:'Instagram', color:'#E1306C', handle: s.instagram ? '@'+s.instagram : '', url: s.instagram ? 'https://instagram.com/'+s.instagram : '' },
    { key:'facebook', icon:'👥', label:'Facebook', color:'#1877F2', handle: s.facebook || '', url: s.facebook ? 'https://facebook.com/'+s.facebook : '' },
    { key:'tiktok', icon:'🎵', label:'TikTok', color:'#010101', handle: s.tiktok || '', url: s.tiktok ? 'https://tiktok.com/'+s.tiktok : '' },
    { key:'youtube', icon:'▶️', label:'YouTube', color:'#FF0000', handle: s.youtube || '', url: s.youtube ? 'https://youtube.com/@'+s.youtube : '' },
  ].filter(x => x.handle);

  document.getElementById('socials-display').innerHTML = items.map(x => `
    <a href="${x.url}" target="_blank" class="social-link">
      <div class="icon" style="background:${x.color}20;border:1px solid ${x.color}33">${x.icon}</div>
      <div><div class="name">${x.label}</div><div class="handle">${x.handle}</div></div>
    </a>
  `).join('') || '<p style="color:var(--text-muted);font-size:0.9rem">No hay redes configuradas</p>';

  document.getElementById('footer-socials').innerHTML = items.map(x => `
    <a href="${x.url}" target="_blank" class="footer-social">${x.icon}</a>
  `).join('');
}

/* =========================================
   UI HELPERS
   ========================================= */
function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click', ()=>document.getElementById('nav-links').classList.remove('open'));
});

function setupNavbar() {
  window.addEventListener('scroll', ()=>{
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });

  // Interactive Hover for Service Cards
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
    });
  });
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2800);
}

/* =========================================
   SCROLL REVEAL
   ========================================= */
let observer;
function setupScrollEffects() {
  observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) { e.target.classList.add('in-view'); }
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>observer.observe(el));
}
function reObserve() {
  if (!observer) return;
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>{
    if(!el.classList.contains('in-view')) observer.observe(el);
  });
}

/* =========================================
   HERO CANVAS — PARTÍCULAS
   ========================================= */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * 1200,
      y: Math.random() * 800,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.5 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,160,23,${p.a})`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212,160,23,${0.08 * (1 - dist/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* =========================================
   HERO LETTERS
   ========================================= */
let heroLetterTimer = null;
function initHeroLetters(name) {
  const el = document.getElementById('hero-title-el');
  if (!el) return;
  clearTimeout(heroLetterTimer);
  el.innerHTML = '';
  const chars = name.split('');
  chars.forEach((ch, i) => {
    const span = document.createElement('span');
    if (ch === ' ') {
      span.className = 'letter space';
    } else {
      span.className = 'letter';
      span.textContent = ch;
      const rx = (Math.random() - 0.5) * 400;
      const ry = (Math.random() - 0.5) * 300;
      const rr = (Math.random() - 0.5) * 90;
      span.style.cssText = `opacity:0;transform:translate(${rx}px,${ry}px) rotate(${rr}deg) scale(2);transition:none`;
    }
    el.appendChild(span);
  });
  requestAnimationFrame(() => {
    el.querySelectorAll('.letter:not(.space)').forEach((span, i) => {
      setTimeout(() => {
        span.style.cssText = `transition:transform ${0.7 + Math.random()*0.3}s cubic-bezier(0.34,1.56,0.64,1) ${i*0.05}s,opacity 0.4s ease ${i*0.05}s;opacity:1;transform:translate(0,0) rotate(0deg) scale(1)`;
      }, 100);
    });
  });
  scheduleDestruction();
}

function scheduleDestruction() {
  heroLetterTimer = setTimeout(() => {
    destructLetters(() => {
      setTimeout(() => initHeroLetters(appData.name), 400);
    });
  }, 5000);
}

function destructLetters(cb) {
  const el = document.getElementById('hero-title-el');
  if (!el) return;
  const letters = el.querySelectorAll('.letter:not(.space)');
  letters.forEach((span, i) => {
    const rx = (Math.random() - 0.5) * 600;
    const ry = (Math.random() - 0.5) * 400;
    const rr = (Math.random() - 0.5) * 180;
    const delay = i * 0.04;
    span.style.cssText = `transition:transform 0.5s cubic-bezier(0.55,0,1,0.45) ${delay}s,opacity 0.4s ease ${delay}s;opacity:0;transform:translate(${rx}px,${ry}px) rotate(${rr}deg) scale(0.2)`;
  });
  setTimeout(cb, letters.length * 40 + 600);
}

/* =========================================
   COUNTER ANIMATION
   ========================================= */
function initCounters() {
  const stats = document.querySelectorAll('.hero-stat-num[data-target]');
  if (!stats.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 40);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => obs.observe(s));
}
