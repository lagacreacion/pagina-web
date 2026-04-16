/* =========================================
   ADMIN PANEL LOGIC
   ========================================= */
function openAdmin() {
  document.getElementById('admin-overlay').classList.remove('hidden');
  document.getElementById('admin-login').classList.remove('hidden');
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('admin-pass').value = '';
  document.getElementById('login-error').style.display = 'none';
  setTimeout(()=>document.getElementById('admin-pass').focus(),100);
}

function closeAdmin() {
  document.getElementById('admin-overlay').classList.add('hidden');
}

document.getElementById('admin-overlay').addEventListener('click', function(e){
  if(e.target === this) closeAdmin();
});

function doLogin() {
  const pass = document.getElementById('admin-pass').value;
  if (pass === appData.password) {
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    loadAdminData();
  } else {
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('admin-pass').style.borderColor = '#ef4444';
    setTimeout(()=>{document.getElementById('admin-pass').style.borderColor='';},1500);
  }
}

function loadAdminData() {
  document.getElementById('a-name').value = appData.name;
  document.getElementById('a-tagline').value = appData.tagline;
  document.getElementById('a-biztype').value = appData.biztype || 'barberia';
  document.getElementById('a-whatsapp').value = appData.whatsapp;
  document.getElementById('a-password').value = '';
  // Socials
  document.getElementById('s-instagram').value = appData.socials.instagram || '';
  document.getElementById('s-facebook').value = appData.socials.facebook || '';
  document.getElementById('s-tiktok').value = appData.socials.tiktok || '';
  document.getElementById('s-youtube').value = appData.socials.youtube || '';
  // Location
  document.getElementById('l-address').value = appData.location.address || '';
  document.getElementById('l-maps').value = appData.location.maps || '';
  document.getElementById('l-city').value = appData.location.city || '';
  // Barbers list
  renderAdminBarbers();
  renderAdminServices();
  renderAdminHours();
}

function switchTab(id) {
  document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(event) event.target.classList.add('active');
}

/* IMAGE HELPERS */
function handleImageUpload(input, targetInputId, previewId) {
  const file = input.files[0];
  if (!file) return;
  
  if (file.size > 800 * 1024) {
    toast('⚠️ Imagen muy grande. Intenta una de menos de 800KB');
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64 = e.target.result;
    document.getElementById(targetInputId).value = base64;
    const preview = document.getElementById(previewId);
    preview.innerHTML = `<img src="${base64}" style="width:100%;height:100%;object-fit:cover">`;
    toast('📸 Foto cargada');
  };
  reader.readAsDataURL(file);
}

/* GENERAL */
function saveGeneral() {
  appData.name = document.getElementById('a-name').value || appData.name;
  appData.tagline = document.getElementById('a-tagline').value || appData.tagline;
  appData.biztype = document.getElementById('a-biztype').value || appData.biztype;
  appData.whatsapp = document.getElementById('a-whatsapp').value || appData.whatsapp;
  const np = document.getElementById('a-password').value;
  if (np) appData.password = np;
  renderPublicPage();
  toast('✅ Información guardada');
}

/* COLORS — PALETTE SYSTEM */
const PALETTES = [
  { id:'gold',       name:'Dorado Imperial',   desc:'El clásico de las barberías premium', emoji:'👑', primary:'#C9A84C', bg:'#0a0a08', secondary:'#131310', text:'#f5f0e8' },
  { id:'crimson',    name:'Rojo Carmesí',       desc:'Intenso, atrevido, memorable',        emoji:'🔥', primary:'#C0392B', bg:'#0d0606', secondary:'#160c0c', text:'#fff0f0' },
  { id:'cobalt',     name:'Azul Cobalto',       desc:'Confianza y estilo moderno',           emoji:'💎', primary:'#2980B9', bg:'#05090e', secondary:'#0a1220', text:'#eef4ff' },
  { id:'emerald',    name:'Verde Esmeralda',    desc:'Fresco, limpio y premium',             emoji:'🌿', primary:'#27AE60', bg:'#050d07', secondary:'#0a1a0e', text:'#edfff4' },
  { id:'violet',     name:'Violeta Oscuro',     desc:'Exclusivo y sofisticado',              emoji:'🪄', primary:'#8E44AD', bg:'#09060d', secondary:'#110c18', text:'#f8f0ff' },
  { id:'copper',     name:'Cobre & Carbón',     desc:'Industrial y masculino',               emoji:'⚙️', primary:'#D4622A', bg:'#0a0806', secondary:'#161009', text:'#fff5ee' },
  { id:'teal',       name:'Petróleo',           desc:'Profundo y diferente',                 emoji:'🌊', primary:'#17A589', bg:'#050d0b', secondary:'#091a16', text:'#eefffc' },
  { id:'gold2',      name:'Champagne & Negro',  desc:'Elegancia absoluta',                   emoji:'✨', primary:'#F0C040', bg:'#080806', secondary:'#111106', text:'#fffff0' },
  { id:'slate',      name:'Gris Carbón',        desc:'Minimalista y profesional',            emoji:'🔩', primary:'#2C3E50', bg:'#f5f6f7', secondary:'#eaecee', text:'#1a1a2e' },
  { id:'navy',       name:'Marino & Blanco',    desc:'Clásico anglosajón',                   emoji:'⚓', primary:'#1A3A5C', bg:'#f4f6f9', secondary:'#e8edf4', text:'#0d1b2a' },
  { id:'forest',     name:'Verde Militar',      desc:'Rústico y auténtico',                  emoji:'🌲', primary:'#2E4A1E', bg:'#f4f7f2', secondary:'#e8f0e4', text:'#1a2a12' },
  { id:'burgundy',   name:'Burdeos & Crema',    desc:'Barbería clásica europea',             emoji:'🍷', primary:'#6D1A36', bg:'#faf6f4', secondary:'#f2eae6', text:'#2d0d18' },
  { id:'titanium',   name:'Titanio',            desc:'Ultra moderno y frío',                 emoji:'🤖', primary:'#95A5A6', bg:'#070809', secondary:'#0e1012', text:'#e8ecef' },
  { id:'rose_dark',  name:'Rosado Oscuro',      desc:'Urbano y trendy',                      emoji:'🌸', primary:'#E91E8C', bg:'#0d0609', secondary:'#1a0c14', text:'#fff0fa' },
  { id:'amber',      name:'Ámbar & Madera',     desc:'Cálido, acogedor y natural',           emoji:'🪵', primary:'#E67E22', bg:'#0d0906', secondary:'#1a1109', text:'#fff8ee' },
];

let selectedPaletteId = null;

function renderPaletteGrid() {
  const grid = document.getElementById('palette-grid');
  grid.innerHTML = PALETTES.map(p => `
    <div class="palette-card${appData.colors._paletteId===p.id?' selected':''}" id="pal-${p.id}" onclick="selectPalette('${p.id}')">
      <div class="palette-card-check">✓</div>
      <div class="palette-card-band">
        <div class="palette-band-block" style="background:${p.bg}"></div>
        <div class="palette-band-block" style="background:${p.secondary}"></div>
        <div class="palette-band-block" style="background:${p.primary}"></div>
        <div class="palette-band-block" style="background:${p.text}22"></div>
      </div>
      <div class="palette-card-body" style="background:${p.secondary}">
        <div class="palette-card-name" style="color:${p.primary}">${p.emoji} ${p.name}</div>
        <div class="palette-card-desc">${p.desc}</div>
      </div>
    </div>
  `).join('');
}

function selectPalette(id) {
  selectedPaletteId = id;
  const p = PALETTES.find(x=>x.id===id);
  document.querySelectorAll('.palette-card').forEach(c=>c.classList.remove('selected'));
  document.getElementById('pal-'+id).classList.add('selected');
  const bar = document.getElementById('palette-preview-bar');
  bar.style.display = 'block';
  bar.style.borderColor = p.primary+'55';
  document.getElementById('palette-preview-content').innerHTML = `
    <div style="display:flex;gap:0.6rem;align-items:center;flex-wrap:wrap">
      <div style="display:flex;border-radius:10px;overflow:hidden;height:36px;width:160px;flex-shrink:0">
        <div style="flex:1;background:${p.bg}"></div>
        <div style="flex:1;background:${p.secondary}"></div>
        <div style="flex:1.5;background:${p.primary}"></div>
        <div style="flex:1;background:${p.text}22"></div>
      </div>
      <div>
        <div style="font-size:1rem;font-weight:800;color:${p.primary}">${p.name}</div>
        <div style="font-size:0.78rem;color:#888">${p.desc}</div>
      </div>
      <div style="display:flex;gap:0.5rem;margin-left:auto">
        ${[p.primary,p.bg,p.secondary,p.text].map(c=>`<div style="width:28px;height:28px;background:${c};border-radius:6px;border:1px solid #fff1"></div>`).join('')}
      </div>
    </div>
  `;
  bar.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function applySelectedPalette() {
  if (!selectedPaletteId) return;
  const p = PALETTES.find(x=>x.id===selectedPaletteId);
  appData.colors = { ...p, _paletteId: p.id };
  applyTheme();
  clearPaletteSelection();
  renderPaletteGrid();
  toast('🎨 Tema "'+p.name+'" aplicado');
}

function clearPaletteSelection() {
  selectedPaletteId = null;
  document.getElementById('palette-preview-bar').style.display = 'none';
  document.querySelectorAll('.palette-card').forEach(c=>c.classList.remove('selected'));
  if (appData.colors._paletteId) {
    const el = document.getElementById('pal-'+appData.colors._paletteId);
    if(el) el.classList.add('selected');
  }
}

/* BARBERS */
let editingBarberId = null;
function renderAdminBarbers() {
  document.getElementById('admin-barbers-list').innerHTML = appData.barbers.map(b => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-name">${b.name}</div>
        <div class="admin-item-sub">${b.specialty} · WA: ${b.whatsapp}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon edit" onclick="editBarber(${b.id})">✏️</button>
        <button class="btn-icon delete" onclick="deleteBarber(${b.id})">🗑️</button>
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted);font-size:0.88rem">Sin barberos</p>';
}
function openBarberForm(data={}) {
  document.getElementById('bf-name').value = data.name||'';
  document.getElementById('bf-specialty').value = data.specialty||'';
  document.getElementById('bf-wa').value = data.whatsapp||'';
  document.getElementById('bf-photo').value = data.photo||'';
  document.getElementById('bf-id').value = data.id||'';
  
  const preview = document.getElementById('bf-preview');
  if (data.photo) {
    preview.innerHTML = `<img src="${data.photo}" style="width:100%;height:100%;object-fit:cover">`;
  } else {
    preview.innerHTML = `<span style="font-size:2rem;opacity:0.2">👤</span>`;
  }

  document.getElementById('barber-form').classList.add('open');
  setTimeout(()=>document.getElementById('barber-form').scrollIntoView({behavior:'smooth',block:'nearest'}),50);
}
function closeBarberForm(){document.getElementById('barber-form').classList.remove('open');editingBarberId=null;}
function editBarber(id) {
  const b = appData.barbers.find(x=>x.id===id);
  if(b) openBarberForm(b);
}
function saveBarber() {
  const id = parseInt(document.getElementById('bf-id').value)||null;
  const b = { name:document.getElementById('bf-name').value, specialty:document.getElementById('bf-specialty').value, whatsapp:document.getElementById('bf-wa').value, photo:document.getElementById('bf-photo').value };
  if (!b.name) { toast('❌ Falta el nombre'); return; }
  if (id) {
    const idx = appData.barbers.findIndex(x=>x.id===id);
    appData.barbers[idx] = {...appData.barbers[idx],...b};
  } else {
    b.id = Date.now();
    appData.barbers.push(b);
  }
  closeBarberForm();
  renderAdminBarbers();
  renderBarbers();
  renderBookingOptions();
  toast('✅ Barbero guardado');
}
function deleteBarber(id) {
  if(!confirm('¿Eliminar este barbero?')) return;
  appData.barbers = appData.barbers.filter(x=>x.id!==id);
  renderAdminBarbers();
  renderBarbers();
  renderBookingOptions();
  toast('🗑️ Barbero eliminado');
}

/* SERVICES */
function renderAdminServices() {
  document.getElementById('admin-services-list').innerHTML = appData.services.map(s => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-name">${s.icon} ${s.name}</div>
        <div class="admin-item-sub">$${Number(s.price).toLocaleString()} · ${s.duration}min</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon edit" onclick="editService(${s.id})">✏️</button>
        <button class="btn-icon delete" onclick="deleteService(${s.id})">🗑️</button>
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-muted);font-size:0.88rem">Sin servicios</p>';
}
function openServiceForm(data={}) {
  document.getElementById('sf-name').value = data.name||'';
  document.getElementById('sf-icon').value = data.icon||'✂️';
  document.getElementById('sf-price').value = data.price||'';
  document.getElementById('sf-duration').value = data.duration||'';
  document.getElementById('sf-photo').value = data.photo||'';
  document.getElementById('sf-id').value = data.id||'';

  const preview = document.getElementById('sf-preview');
  if (data.photo) {
    preview.innerHTML = `<img src="${data.photo}" style="width:100%;height:100%;object-fit:cover">`;
  } else {
    preview.innerHTML = `<span style="font-size:2rem;opacity:0.2">✂️</span>`;
  }

  document.getElementById('service-form').classList.add('open');
  setTimeout(()=>document.getElementById('service-form').scrollIntoView({behavior:'smooth',block:'nearest'}),50);
}
function closeServiceForm(){document.getElementById('service-form').classList.remove('open');}
function editService(id) {
  const s = appData.services.find(x=>x.id===id);
  if(s) openServiceForm(s);
}
function saveService() {
  const id = parseInt(document.getElementById('sf-id').value)||null;
  const s = { 
    name:document.getElementById('sf-name').value, 
    icon:document.getElementById('sf-icon').value||'✂️', 
    price:parseInt(document.getElementById('sf-price').value)||0, 
    duration:parseInt(document.getElementById('sf-duration').value)||30,
    photo:document.getElementById('sf-photo').value || ''
  };
  if (!s.name) { toast('❌ Falta el nombre'); return; }
  if (id) {
    const idx = appData.services.findIndex(x=>x.id===id);
    appData.services[idx] = {...appData.services[idx],...s};
  } else {
    s.id = Date.now();
    appData.services.push(s);
  }
  closeServiceForm();
  renderAdminServices();
  renderServices();
  renderBookingOptions();
  toast('✅ Servicio guardado');
}
function deleteService(id) {
  if(!confirm('¿Eliminar este servicio?')) return;
  appData.services = appData.services.filter(x=>x.id!==id);
  renderAdminServices();
  renderServices();
  renderBookingOptions();
  toast('🗑️ Servicio eliminado');
}

/* HOURS */
function dayKey(day){ return 'day'+Object.keys(appData.hours).indexOf(day); }

function renderAdminHours() {
  const grid = document.getElementById('hours-admin-grid');
  grid.innerHTML = Object.entries(appData.hours).map(([day,h]) => {
    const k = dayKey(day);
    return `
    <div class="hours-admin-row">
      <span class="hours-admin-day">${day}</span>
      <input type="time" class="admin-form-control" id="ho-${k}-open" value="${h.open}" ${h.closed?'disabled':''}>
      <input type="time" class="admin-form-control" id="ho-${k}-close" value="${h.close}" ${h.closed?'disabled':''}>
      <label class="hours-checkbox">
        <input type="checkbox" id="ho-${k}-closed" ${h.closed?'checked':''} onchange="toggleDayClosed('${day}')">
        Cerrado
      </label>
    </div>`;
  }).join('');
}
function toggleDayClosed(day) {
  const k = dayKey(day);
  const closed = document.getElementById('ho-'+k+'-closed').checked;
  document.getElementById('ho-'+k+'-open').disabled = closed;
  document.getElementById('ho-'+k+'-close').disabled = closed;
}
function saveHours() {
  Object.keys(appData.hours).forEach(day => {
    const k = dayKey(day);
    const closed = document.getElementById('ho-'+k+'-closed')?.checked || false;
    const open   = document.getElementById('ho-'+k+'-open')?.value  || '';
    const close  = document.getElementById('ho-'+k+'-close')?.value || '';
    appData.hours[day] = {open, close, closed};
  });
  renderHours();
  toast('✅ Horarios guardados');
}

/* SOCIALS */
function saveSocials() {
  appData.socials = {
    instagram: document.getElementById('s-instagram').value,
    facebook: document.getElementById('s-facebook').value,
    tiktok: document.getElementById('s-tiktok').value,
    youtube: document.getElementById('s-youtube').value,
  };
  renderSocials();
  toast('✅ Redes guardadas');
}

/* BOOKINGS VIEW */
function loadAdminBookings() {
  const all = loadBookings().sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const el = document.getElementById('admin-bookings-list');
  const empty = document.getElementById('admin-bookings-empty');
  if (!all.length) { el.innerHTML=''; empty.style.display='block'; return; }
  empty.style.display='none';
  el.innerHTML = all.map(b => {
    const d = new Date(b.date+'T12:00:00').toLocaleDateString('es',{weekday:'short',day:'numeric',month:'short'});
    return `
    <div class="admin-item" style="flex-wrap:wrap;gap:0.6rem">
      <div class="admin-item-info" style="min-width:180px">
        <div class="admin-item-name">👤 ${b.clientName}</div>
        <div class="admin-item-sub">📧 ${b.clientEmail}</div>
      </div>
      <div class="admin-item-info" style="min-width:160px">
        <div class="admin-item-name">✂️ ${b.service}</div>
        <div class="admin-item-sub">👨‍💼 ${b.barberName} · ⏱ ${b.duration}min</div>
      </div>
      <div class="admin-item-info">
        <div class="admin-item-name" style="color:var(--primary)">📅 ${d} 🕐 ${b.time}</div>
        <div class="admin-item-sub">💰 $${Number(b.price||0).toLocaleString()}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-icon delete" title="Cancelar reserva" onclick="deleteBookingById('${b.id}');loadAdminBookings();buildTimeGrid();toast('🗑️ Reserva cancelada')">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

/* LOCATION */
function saveLocation() {
  appData.location = {
    address: document.getElementById('l-address').value,
    maps: document.getElementById('l-maps').value,
    city: document.getElementById('l-city').value,
  };
  renderLocation();
  toast('✅ Ubicación guardada');
}
