import { Animal } from "./Animal.js";
import { openBooking } from "./booking.js";

const TYPE_CLASS = {
    "Хөхтөн":        "badge-mammal",
    "Шувуу":          "badge-bird",
    "Холимог идэшт":  "badge-mixed",
};

const PROTECTED = ["Ирвэс", "Мазаалай", "Тахь"];

export function showLoading(containerId = "animalList") {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = Array.from({ length: 6 }, () => `
        <div class="skeleton-card">
            <div class="skeleton-img skeleton-pulse"></div>
            <div class="skeleton-body">
                <div class="skeleton-line skeleton-pulse" style="width:55%"></div>
                <div class="skeleton-line skeleton-pulse" style="width:35%;height:10px"></div>
                <div class="skeleton-line skeleton-pulse" style="width:80%;height:10px"></div>
                <div class="skeleton-line skeleton-pulse" style="width:65%;height:10px"></div>
            </div>
        </div>
    `).join("");
}

export function displayAnimals(list, containerId = "animalList", headerId = "resultsHeader") {
    const container = document.getElementById(containerId);
    const header    = document.getElementById(headerId);

    if (!list.length) {
        if (header) header.textContent = "Хайлт илэрцгүй байна";
        container.innerHTML = `<div class="no-results">Таны хайлтад тохирох амьтан олдсонгүй.</div>`;
        return;
    }

    // map · reduce · join ашиглан статистик гаргана
    const count       = list.reduce(acc => acc + 1, 0);
    const uniqueTypes = list
        .map(a => a.type)
        .reduce((acc, t) => acc.includes(t) ? acc : [...acc, t], [])
        .join(", ");

    if (header) header.textContent = `${count} амьтан (${uniqueTypes})`;

    container.innerHTML = list
        .map(item => {
            const a         = new Animal(item);
            const badgeCls  = TYPE_CLASS[a.type] || "badge-mammal";
            return `
            <div class="animal-card" data-name="${a.name}"
                 role="button" tabindex="0" aria-label="${a.name} дэлгэрэнгүй харах">
                <div class="animal-card-img-wrap">
                    <img src="${a.image}" alt="${a.name}" loading="lazy"
                         onerror="this.style.display='none'">
                    <span class="animal-type-badge ${badgeCls}">${a.type}</span>
                </div>
                <div class="card-body">
                    <h3>${a.name}</h3>
                    <div class="card-meta">
                        <span class="card-region">${a.region}</span>
                    </div>
                    <p class="card-desc">${a.description}</p>
                    <div class="card-footer">
                        <span class="card-link">Дэлгэрэнгүй харах</span>
                        <button class="btn-book ${PROTECTED.includes(a.name) ? 'btn-book-disabled' : ''}"
                                data-book="${a.name}"
                                ${PROTECTED.includes(a.name) ? 'title="Хамгаалалттай амьтан — захиалга хориотой"' : ''}>
                            ${PROTECTED.includes(a.name) ? '🔒 Хориотой' : '🏹 Захиалах'}
                        </button>
                    </div>
                </div>
            </div>`;
        })
        .join("");

    container.querySelectorAll('.btn-book:not(.btn-book-disabled)').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const name   = btn.dataset.book;
            const animal = list.find(a => a.name === name);
            if (animal) openBooking(animal);
        });
    });
}
