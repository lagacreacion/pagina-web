const BIZ_TYPES = {
  barberia:    { label:'Barbería',      team:'Barberos',      pro:'Barbero',    icon:'✂️', badge:'Barbería Premium',     emoji:'✂️💈🪒' },
  salon:       { label:'Salón de Uñas', team:'Nail Artists',  pro:'Especialista',icon:'💅', badge:'Salón Premium',        emoji:'💅💎✨' },
  peluqueria:  { label:'Peluquería',    team:'Estilistas',    pro:'Estilista',  icon:'💇', badge:'Peluquería Premium',    emoji:'💇✂️🌟' },
  spa:         { label:'Spa & Estética',team:'Terapeutas',    pro:'Terapeuta',  icon:'🧖', badge:'Spa Premium',           emoji:'🧖🌿✨' },
  tatuajes:    { label:'Tattoo Studio', team:'Artistas',      pro:'Artista',    icon:'🎨', badge:'Studio Premium',        emoji:'🎨🖊️✦' },
  otro:        { label:'Estudio',       team:'Profesionales', pro:'Profesional',icon:'⭐', badge:'Estudio Premium',       emoji:'⭐✦💎' },
};

let appData = {
  name: 'BarberKing',
  tagline: 'Cortes de otro nivel. Estilo que define.',
  biztype: 'barberia',
  whatsapp: '5491112345678',
  password: 'admin123',
  colors: { primary:'#D4A017', bg:'#0a0a0a', secondary:'#111111', text:'#f5f5f5' },
  barbers: [
    { id:1, name:'Carlos Mendez', specialty:'Fade & Degradé', whatsapp:'5491123456789', photo:'' },
    { id:2, name:'Diego Torres', specialty:'Barba & Diseño', whatsapp:'5491187654321', photo:'' },
    { id:3, name:'Mateo Ruiz', specialty:'Clásico & Moderno', whatsapp:'5491156781234', photo:'' },
  ],
  services: [
    { id:1, name:'Corte Clásico', icon:'✂️', price:3500, duration:30 },
    { id:2, name:'Fade Premium', icon:'💈', price:4500, duration:45 },
    { id:3, name:'Barba Completa', icon:'🪒', price:2800, duration:25 },
    { id:4, name:'Corte + Barba', icon:'👑', price:6500, duration:60 },
    { id:5, name:'Alisado/Keratina', icon:'✨', price:8000, duration:90 },
    { id:6, name:'Diseño Especial', icon:'🎨', price:5500, duration:50 },
  ],
  hours: {
    Lunes:    { open:'09:00', close:'20:00', closed:false },
    Martes:   { open:'09:00', close:'20:00', closed:false },
    Miércoles:{ open:'09:00', close:'20:00', closed:false },
    Jueves:   { open:'09:00', close:'21:00', closed:false },
    Viernes:  { open:'09:00', close:'21:00', closed:false },
    Sábado:   { open:'09:00', close:'18:00', closed:false },
    Domingo:  { open:'', close:'', closed:true },
  },
  socials: { instagram:'barberkingoficial', facebook:'barberkingpage', tiktok:'@barberking', youtube:'' },
  location: { address:'Av. Corrientes 1234, CABA', maps:'https://maps.google.com', city:'Buenos Aires, Argentina' },
};

/* =========================================
   BOOKINGS PERSISTENCE (localStorage)
   ========================================= */
const STORAGE_KEY = 'barber_bookings_v1';

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : [];
    const today = new Date().toISOString().split('T')[0];
    const valid = all.filter(b => b.date >= today);
    if (valid.length !== all.length) saveBookingsRaw(valid);
    return valid;
  } catch(e) { return []; }
}

function saveBookingsRaw(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch(e){}
}

function addBooking(entry) {
  const all = loadBookings();
  all.push(entry);
  saveBookingsRaw(all);
}

function deleteBookingById(id) {
  const all = loadBookings().filter(b => b.id !== id);
  saveBookingsRaw(all);
}

function isSlotTaken(barberId, date, timeStr, excludeId=null) {
  const all = loadBookings();
  const slotMin = timeToMin(timeStr);
  return all.some(b => {
    if (b.id === excludeId) return false;
    if (b.barberId !== barberId || b.date !== date) return false;
    const bStart = timeToMin(b.time);
    const bEnd   = bStart + (b.duration || 30);
    return slotMin < bEnd && slotMin + 30 > bStart;
  });
}

function timeToMin(t) {
  const [h,m] = t.split(':').map(Number);
  return h*60+m;
}

let booking = { service:null, barber:null, date:null, time:null, name:'', email:'' };
