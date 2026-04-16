/* =========================================
   BOOKING SYSTEM
   ========================================= */
let currentStep = 1;

function renderBookingOptions() {
  // Services
  document.getElementById('booking-services').innerHTML = appData.services.map(s => `
    <div class="card-option" onclick="selectService(${s.id})" id="bsvc-${s.id}">
      <span class="card-option-icon">${s.icon}</span>
      <div class="card-option-name">${s.name}</div>
      <div class="card-option-sub">$${Number(s.price).toLocaleString()} · ${s.duration}min</div>
    </div>
  `).join('');
  // Barbers
  document.getElementById('booking-barbers').innerHTML = appData.barbers.map(b => `
    <div class="card-option" onclick="selectBarber(${b.id})" id="bbar-${b.id}">
      <span class="card-option-icon">👤</span>
      <div class="card-option-name">${b.name}</div>
      <div class="card-option-sub">${b.specialty}</div>
    </div>
  `).join('');
}

function selectService(id) {
  booking.service = id;
  document.querySelectorAll('#booking-services .card-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('bsvc-'+id).classList.add('selected');
  checkStep1();
}

function selectBarber(id) {
  booking.barber = id;
  booking.time = null; // resetear hora al cambiar barbero
  document.querySelectorAll('#booking-barbers .card-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('bbar-'+id).classList.add('selected');
  // Si ya hay fecha seleccionada, recalcular grid de horarios
  if (booking.date) buildTimeGrid();
  checkStep1();
}

function checkStep1() {
  document.getElementById('next-1').disabled = !(booking.service && booking.barber);
}

function buildDateGrid() {
  const el = document.getElementById('date-grid');
  const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const today = new Date();
  let html = '';
  for (let i = 0; i < 9; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('es', {month:'short'});
    const label = i === 0 ? 'Hoy' : days[d.getDay()];
    html += `
      <div class="date-btn" onclick="selectDate(this,'${d.toISOString().split('T')[0]}')" data-date="${d.toISOString().split('T')[0]}">
        <span class="day-name">${label}</span>
        ${dayNum} ${monthName}
      </div>`;
  }
  el.innerHTML = html;
}

function selectDate(el, dateStr) {
  booking.date = dateStr;
  document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  buildTimeGrid();
  document.getElementById('time-group').style.display = 'block';
  booking.time = null;
  checkStep2();
}

function buildTimeGrid() {
  if (!booking.date) return;
  const el = document.getElementById('time-grid');
  const d = new Date(booking.date+'T12:00:00');
  const dayName = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][d.getDay()];
  const hrs = appData.hours[dayName];
  if (!hrs || hrs.closed) {
    el.innerHTML = '<p style="color:#ef4444;font-size:0.88rem;grid-column:1/-1">Cerrado ese día</p>';
    return;
  }
  const [oh,om] = hrs.open.split(':').map(Number);
  const [ch,cm] = hrs.close.split(':').map(Number);
  let slots = [];
  let cur = oh * 60 + om;
  const end = ch * 60 + cm - 30;
  while (cur <= end) {
    const hh = Math.floor(cur/60).toString().padStart(2,'0');
    const mm = (cur%60).toString().padStart(2,'0');
    slots.push(`${hh}:${mm}`);
    cur += 30;
  }
  el.innerHTML = slots.map(t => {
    const taken = booking.barber ? isSlotTaken(booking.barber, booking.date, t) : false;
    return `<div class="time-btn${taken?' booked':''}" ${taken ? 'title="Horario ocupado"' : `onclick="selectTime(this,'${t}')"`}>${t}</div>`;
  }).join('');
}

function selectTime(el, t) {
  booking.time = t;
  document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  checkStep2();
}

function checkStep2() {
  document.getElementById('next-2').disabled = !(booking.date && booking.time);
}

function updateSummary() {
  const svc = appData.services.find(s => s.id === booking.service);
  const bar = appData.barbers.find(b => b.id === booking.barber);
  const dateObj = new Date(booking.date+'T12:00:00');
  const dateStr = dateObj.toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long'});
  document.getElementById('booking-summary').innerHTML = `
    <div class="summary-row"><span class="summary-label">Servicio</span><span class="summary-value">${svc?.icon} ${svc?.name}</span></div>
    <div class="summary-row"><span class="summary-label">Barbero</span><span class="summary-value">👤 ${bar?.name}</span></div>
    <div class="summary-row"><span class="summary-label">Fecha</span><span class="summary-value">📅 ${dateStr}</span></div>
    <div class="summary-row"><span class="summary-label">Hora</span><span class="summary-value">🕐 ${booking.time}</span></div>
    <div class="summary-row"><span class="summary-label">Precio</span><span class="summary-value" style="color:var(--primary);font-weight:800">$${Number(svc?.price).toLocaleString()}</span></div>
  `;
}

function checkStep3() {
  const name = document.getElementById('b-name').value.trim();
  const email = document.getElementById('b-email').value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  booking.name = name;
  booking.email = email;
  document.getElementById('next-3').disabled = !(name && emailOk);
}

function confirmBooking() {
  const svc = appData.services.find(s => s.id === booking.service);
  const bar = appData.barbers.find(b => b.id === booking.barber);
  const dateObj = new Date(booking.date+'T12:00:00');
  const dateStr = dateObj.toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  const msg = `🔔 *Nueva Reserva — ${appData.name}*

👤 *Cliente:* ${booking.name}
📧 *Email:* ${booking.email}

✂️ *Servicio:* ${svc?.icon} ${svc?.name}
👨‍💼 *Barbero:* ${bar?.name}
📅 *Fecha:* ${dateStr}
🕐 *Hora:* ${booking.time}
💰 *Precio:* $${Number(svc?.price).toLocaleString()}

¡Hasta pronto! 💈`;

  const waNum = bar?.whatsapp || appData.whatsapp;
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
  document.getElementById('whatsapp-confirm-btn').href = waUrl;

  // Guardar reserva para bloquear el slot
  addBooking({
    id: Date.now().toString(),
    barberId: booking.barber,
    barberName: bar?.name,
    date: booking.date,
    time: booking.time,
    duration: svc?.duration || 30,
    service: svc?.name,
    clientName: booking.name,
    clientEmail: booking.email,
    price: svc?.price,
  });

  goStep(4);
}

function goStep(n) {
  if (n === 3) updateSummary();
  // Update indicators
  for (let i = 1; i <= 4; i++) {
    const ind = document.getElementById('step-ind-'+i);
    ind.classList.remove('active','done');
    if (i < n) ind.classList.add('done');
    if (i === n) ind.classList.add('active');
  }
  // Show panel
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-'+n).classList.add('active');
  currentStep = n;
  document.getElementById('booking').scrollIntoView({behavior:'smooth',block:'start'});
}

function resetBooking() {
  booking = { service:null, barber:null, date:null, time:null, name:'', email:'' };
  document.getElementById('b-name').value = '';
  document.getElementById('b-email').value = '';
  document.querySelectorAll('.card-option').forEach(el=>el.classList.remove('selected'));
  document.querySelectorAll('.date-btn').forEach(el=>el.classList.remove('selected'));
  document.querySelectorAll('.time-btn').forEach(el=>el.classList.remove('selected'));
  document.getElementById('time-group').style.display = 'none';
  goStep(1);
}
