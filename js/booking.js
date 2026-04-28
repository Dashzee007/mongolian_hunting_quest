import { getSession } from './auth.js';

const BOOKINGS_KEY = 'mhq_bookings';
let lawsData = null;

async function loadLaws() {
    if (lawsData) return lawsData;
    try {
        const res = await fetch('../data/laws.json');
        lawsData = await res.json();
    } catch {
        lawsData = { protected: [], general: [], byType: {}, byAnimal: {} };
    }
    return lawsData;
}

function saveBooking(booking) {
    const list = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    list.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
}

export function getBookings() {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
}

function formatPrice(n) {
    return n.toLocaleString('mn-MN') + ' ₮';
}

function genId() {
    return 'MHQ-' + Date.now().toString(36).toUpperCase();
}

// ── Inject modal HTML once ──────────────────────────────────────
function ensureModal() {
    if (document.getElementById('bookingModal')) return;

    document.body.insertAdjacentHTML('beforeend', `
    <div id="bookingModal" class="bk-overlay" hidden>
      <div class="bk-box" role="dialog" aria-modal="true" aria-labelledby="bkTitle">

        <!-- Header -->
        <div class="bk-header">
          <div class="bk-steps">
            <span class="bk-step" data-step="1">1 Хууль</span>
            <span class="bk-step-sep">›</span>
            <span class="bk-step" data-step="2">2 Захиалга</span>
            <span class="bk-step-sep">›</span>
            <span class="bk-step" data-step="3">3 Төлбөр</span>
            <span class="bk-step-sep">›</span>
            <span class="bk-step" data-step="4">4 Баталгаа</span>
          </div>
          <button class="bk-close" id="bkClose" aria-label="Хаах">✕</button>
        </div>

        <!-- Content area (filled per step) -->
        <div class="bk-body" id="bkBody"></div>

      </div>
    </div>`);

    document.getElementById('bkClose').addEventListener('click', closeBooking);
    document.getElementById('bookingModal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeBooking();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeBooking();
    });
}

function closeBooking() {
    const m = document.getElementById('bookingModal');
    if (m) { m.hidden = true; document.body.style.overflow = ''; }
}

function setStep(n) {
    document.querySelectorAll('.bk-step').forEach(el => {
        const s = +el.dataset.step;
        el.classList.toggle('bk-step-active',   s === n);
        el.classList.toggle('bk-step-done',     s < n);
    });
}

// ── STEP 1: Laws ────────────────────────────────────────────────
async function showStep1(animal) {
    setStep(1);
    const laws  = await loadLaws();
    const info  = laws.byAnimal[animal.name] || {};
    const type  = animal.type;
    const typeLaws   = laws.byType[type] || [];
    const allLaws    = [...laws.general, ...typeLaws];

    const lawsHtml = allLaws.map(l => `
        <div class="bk-law-item">
          <div class="bk-law-code">${l.code}</div>
          <div class="bk-law-title">${l.title}</div>
          <p class="bk-law-text">${l.text}</p>
        </div>`).join('');

    const extraHtml = info.extra
        ? `<div class="bk-law-item bk-law-special">
             <div class="bk-law-code">Тусгай шаардлага</div>
             <p class="bk-law-text">${info.extra}</p>
           </div>`
        : '';

    document.getElementById('bkBody').innerHTML = `
      <div class="bk-animal-banner">
        <img src="${animal.image}" alt="${animal.name}" class="bk-animal-img">
        <div class="bk-animal-info">
          <h2 id="bkTitle">${animal.name}</h2>
          <p>${animal.type} · ${animal.region}</p>
          ${info.season ? `<p class="bk-season">Агнуурын улирал: <strong>${info.season}</strong></p>` : ''}
          ${info.price  ? `<p class="bk-price-tag">Захиалгын үнэ: <strong>${formatPrice(info.price)}</strong></p>` : ''}
          ${info.quota  ? `<p class="bk-quota">Жилийн квот: <strong>${info.quota} ширхэг</strong></p>` : ''}
        </div>
      </div>

      <h3 class="bk-section-title">Холбогдох хууль тогтоомж</h3>
      <div class="bk-laws-list">
        ${lawsHtml}
        ${extraHtml}
      </div>

      <label class="bk-confirm-label" id="bkLawConfirmWrap">
        <input type="checkbox" id="bkLawCheck">
        <span>Дээрх хууль тогтоомжийг уншиж, ойлгосон бөгөөд бүрэн дагаж мөрдөхөө баталгаажуулж байна.</span>
      </label>

      <div class="bk-footer">
        <button class="bk-btn bk-btn-ghost" onclick="(${closeBooking.toString()})()">Болих</button>
        <button class="bk-btn bk-btn-primary" id="bkToStep2" disabled>Үргэлжлүүлэх →</button>
      </div>`;

    const check = document.getElementById('bkLawCheck');
    const next  = document.getElementById('bkToStep2');
    check.addEventListener('change', () => { next.disabled = !check.checked; });
    next.addEventListener('click',   () => showStep2(animal, laws));
}

// ── STEP 2: Booking details ──────────────────────────────────────
function showStep2(animal, laws) {
    setStep(2);
    const info  = laws.byAnimal[animal.name] || {};
    const today = new Date().toISOString().split('T')[0];

    document.getElementById('bkBody').innerHTML = `
      <h2 id="bkTitle" class="bk-step-heading">Захиалгын мэдээлэл</h2>

      <div class="bk-form">
        <div class="bk-form-row">
          <div class="bk-field">
            <label for="bkDate">Агнуурын огноо</label>
            <input id="bkDate" type="date" min="${today}" value="${today}">
          </div>
          <div class="bk-field">
            <label for="bkPeople">Агнагчдын тоо</label>
            <select id="bkPeople">
              <option value="1">1 хүн</option>
              <option value="2">2 хүн</option>
              <option value="3">3 хүн</option>
              <option value="4">4 хүн</option>
            </select>
          </div>
        </div>

        <div class="bk-field">
          <label for="bkGuide">Гарын авлага хэрэгтэй юу?</label>
          <select id="bkGuide">
            <option value="no">Үгүй</option>
            <option value="yes">Тийм (+500,000 ₮)</option>
          </select>
        </div>

        <div class="bk-field">
          <label for="bkNotes">Нэмэлт тэмдэглэл</label>
          <textarea id="bkNotes" rows="3" placeholder="Тусгай хүсэлт эсвэл нэмэлт мэдээлэл..."></textarea>
        </div>
      </div>

      <div class="bk-summary" id="bkSummary"></div>

      <div class="bk-footer">
        <button class="bk-btn bk-btn-ghost" id="bkBack2">← Буцах</button>
        <button class="bk-btn bk-btn-primary" id="bkToStep3">Төлбөр рүү →</button>
      </div>`;

    const basePrice = info.price || 0;

    function updateSummary() {
        const guide  = document.getElementById('bkGuide').value === 'yes' ? 500000 : 0;
        const people = +document.getElementById('bkPeople').value;
        const total  = basePrice * people + guide;
        document.getElementById('bkSummary').innerHTML = `
          <div class="bk-sum-row"><span>Амьтан</span><span>${animal.name}</span></div>
          <div class="bk-sum-row"><span>Огноо</span><span>${document.getElementById('bkDate').value}</span></div>
          <div class="bk-sum-row"><span>Агнагчдын тоо</span><span>${people} хүн</span></div>
          <div class="bk-sum-row"><span>Нэгж үнэ</span><span>${formatPrice(basePrice)}</span></div>
          ${guide ? `<div class="bk-sum-row"><span>Гарын авлага</span><span>${formatPrice(guide)}</span></div>` : ''}
          <div class="bk-sum-row bk-sum-total"><span>Нийт дүн</span><span>${formatPrice(total)}</span></div>`;
    }

    ['bkDate','bkPeople','bkGuide'].forEach(id =>
        document.getElementById(id).addEventListener('change', updateSummary));
    updateSummary();

    document.getElementById('bkBack2').addEventListener('click', () => showStep1(animal));
    document.getElementById('bkToStep3').addEventListener('click', () => {
        const date   = document.getElementById('bkDate').value;
        const people = +document.getElementById('bkPeople').value;
        const guide  = document.getElementById('bkGuide').value === 'yes';
        const notes  = document.getElementById('bkNotes').value;
        const total  = basePrice * people + (guide ? 500000 : 0);
        showStep3(animal, { date, people, guide, notes, total, basePrice });
    });
}

// ── STEP 3: Payment ──────────────────────────────────────────────
function showStep3(animal, order) {
    setStep(3);

    document.getElementById('bkBody').innerHTML = `
      <h2 id="bkTitle" class="bk-step-heading">Төлбөр хийх</h2>

      <div class="bk-pay-amount">
        Нийт төлбөр: <strong>${formatPrice(order.total)}</strong>
      </div>

      <div class="bk-form">
        <div class="bk-field">
          <label for="bkCardName">Карт эзэмшигчийн нэр</label>
          <input id="bkCardName" type="text" placeholder="НЭРИЙН ҮСГЭЭР" autocomplete="cc-name"
                 style="text-transform:uppercase">
        </div>
        <div class="bk-field">
          <label for="bkCardNum">Картын дугаар</label>
          <input id="bkCardNum" type="text" placeholder="0000 0000 0000 0000"
                 maxlength="19" autocomplete="cc-number" inputmode="numeric">
        </div>
        <div class="bk-form-row">
          <div class="bk-field">
            <label for="bkExpiry">Хүчинтэй хугацаа</label>
            <input id="bkExpiry" type="text" placeholder="MM/YY" maxlength="5"
                   autocomplete="cc-exp" inputmode="numeric">
          </div>
          <div class="bk-field">
            <label for="bkCvv">CVV</label>
            <input id="bkCvv" type="password" placeholder="•••" maxlength="4"
                   autocomplete="cc-csc" inputmode="numeric">
          </div>
        </div>
      </div>

      <div class="bk-pay-note">
        🔒 Таны төлбөрийн мэдээлэл аюулгүй шифрлэгдэн боловсруулагдана.
        Энэхүү систем нь demo зориулалттай бөгөөд бодит төлбөр авахгүй.
      </div>

      <div id="bkPayError" class="bk-pay-error" hidden></div>

      <div class="bk-footer">
        <button class="bk-btn bk-btn-ghost" id="bkBack3">← Буцах</button>
        <button class="bk-btn bk-btn-pay" id="bkPay">Төлбөр хийх ✓</button>
      </div>`;

    // Card number formatting
    document.getElementById('bkCardNum').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
    document.getElementById('bkExpiry').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
        e.target.value = v;
    });

    document.getElementById('bkBack3').addEventListener('click', () => showStep2(animal, lawsData));
    document.getElementById('bkPay').addEventListener('click',   () => processPayment(animal, order));
}

function processPayment(animal, order) {
    const name   = document.getElementById('bkCardName').value.trim();
    const num    = document.getElementById('bkCardNum').value.replace(/\s/g, '');
    const expiry = document.getElementById('bkExpiry').value.trim();
    const cvv    = document.getElementById('bkCvv').value.trim();
    const errEl  = document.getElementById('bkPayError');

    errEl.hidden = true;

    if (!name)                { showPayErr('Карт эзэмшигчийн нэр оруулна уу'); return; }
    if (num.length !== 16)    { showPayErr('Картын дугаар буруу байна'); return; }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) { showPayErr('Хугацаа MM/YY форматтай байна'); return; }
    if (cvv.length < 3)       { showPayErr('CVV буруу байна'); return; }

    const btn = document.getElementById('bkPay');
    btn.disabled    = true;
    btn.textContent = 'Боловсруулж байна…';

    setTimeout(() => {
        const session = getSession();
        const booking = {
            id:        genId(),
            userId:    session?.id || null,
            username:  session?.username || 'Зочин',
            animal:    animal.name,
            region:    animal.region,
            date:      order.date,
            people:    order.people,
            guide:     order.guide,
            notes:     order.notes,
            total:     order.total,
            cardLast4: num.slice(-4),
            bookedAt:  new Date().toISOString()
        };
        saveBooking(booking);
        showStep4(booking, animal);
    }, 1400);
}

function showPayErr(msg) {
    const el = document.getElementById('bkPayError');
    el.textContent = msg;
    el.hidden = false;
}

// ── STEP 4: Confirmation ────────────────────────────────────────
function showStep4(booking, animal) {
    setStep(4);

    document.getElementById('bkBody').innerHTML = `
      <div class="bk-success">
        <div class="bk-success-icon">✓</div>
        <h2>Захиалга амжилттай!</h2>
        <p>Таны захиалгын дугаар:</p>
        <div class="bk-booking-id">${booking.id}</div>

        <div class="bk-receipt">
          <div class="bk-sum-row"><span>Амьтан</span><span>${booking.animal}</span></div>
          <div class="bk-sum-row"><span>Бүс нутаг</span><span>${booking.region}</span></div>
          <div class="bk-sum-row"><span>Огноо</span><span>${booking.date}</span></div>
          <div class="bk-sum-row"><span>Агнагчдын тоо</span><span>${booking.people} хүн</span></div>
          <div class="bk-sum-row"><span>Гарын авлага</span><span>${booking.guide ? 'Тийм' : 'Үгүй'}</span></div>
          <div class="bk-sum-row"><span>Картын сүүлийн 4 орон</span><span>•••• ${booking.cardLast4}</span></div>
          <div class="bk-sum-row bk-sum-total"><span>Нийт төлбөр</span><span>${formatPrice(booking.total)}</span></div>
        </div>

        <p class="bk-receipt-note">
          Захиалгын баталгааг бүртгэлтэй имэйл рүү илгээх болно.<br>
          Асуулт байвал <strong>info@mhq.mn</strong>-д хандана уу.
        </p>

        <button class="bk-btn bk-btn-primary" id="bkDone" style="width:100%;margin-top:8px">
          Хаах
        </button>
      </div>`;

    document.getElementById('bkDone').addEventListener('click', closeBooking);
}

// ── Public entry point ──────────────────────────────────────────
export async function openBooking(animal) {
    const laws = await loadLaws();

    if (laws.protected.includes(animal.name)) {
        alert(`"${animal.name}" нь улаан номонд орсон хамгаалалттай амьтан тул агнуур хориотой.`);
        return;
    }

    if (!laws.byAnimal[animal.name]) {
        alert(`"${animal.name}" амьтанд одоогоор захиалгын мэдээлэл бэлэн болоогүй байна.`);
        return;
    }

    ensureModal();
    const modal = document.getElementById('bookingModal');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    showStep1(animal);
}
