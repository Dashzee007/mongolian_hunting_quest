import { getAnimals } from "./api.js";
import { Animal } from "./Animal.js";
import { showLoading, displayAnimals } from "./ui.js";
import { openBooking } from "./booking.js";

const TYPE_CLASS = {
    "Хөхтөн":        "badge-mammal",
    "Шувуу":          "badge-bird",
    "Холимог идэшт":  "badge-mixed",
};

const PROTECTED = ["Ирвэс", "Мазаалай", "Тахь"];

let allAnimals = [];

async function init() {
    showLoading("animalsGrid");
    allAnimals = await getAnimals();
    populateRegions(allAnimals);
    render(allAnimals);
    setupEvents();
}

function populateRegions(list) {
    const select  = document.getElementById("a-region");
    const regions = [...new Set(list.map(a => a.region))].sort();
    regions.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r; opt.textContent = r;
        select.appendChild(opt);
    });
}

function getFiltered() {
    const query  = document.getElementById("a-search").value.toLowerCase();
    const type   = document.getElementById("a-type").value;
    const region = document.getElementById("a-region").value;

    return allAnimals.filter(a => {
        const matchName   = a.name.toLowerCase().includes(query);
        const matchType   = type   === "all" || a.type   === type;
        const matchRegion = region === "all" || a.region === region;
        return matchName && matchType && matchRegion;
    });
}

function render(list) {
    const grid  = document.getElementById("animalsGrid");
    const stats = document.getElementById("filterStats");

    const typesSummary = [...new Set(list.map(a => a.type))].join(", ");
    stats.textContent = list.length
        ? `${list.length} амьтан (${typesSummary})`
        : "Тохирох амьтан олдсонгүй";

    if (!list.length) {
        grid.innerHTML = `<div class="no-results">Таны шүүлтэд тохирох амьтан олдсонгүй.</div>`;
        return;
    }

    grid.innerHTML = list.map(item => {
        const a        = new Animal(item);
        const badgeCls = TYPE_CLASS[a.type] || "badge-mammal";
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
                    </div>
                </div>
            </div>`;
    }).join("");

    grid.querySelectorAll(".animal-card").forEach(card => {
        card.addEventListener("click", e => {
            if (e.target.closest(".btn-book")) return;
            openModal(card.dataset.name);
        });
        card.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") openModal(card.dataset.name);
        });
    });
}

function openModal(name) {
    const a = allAnimals.find(x => x.name === name);
    if (!a) return;

    const badgeCls = TYPE_CLASS[a.type] || "badge-mammal";
    document.getElementById("modalImg").src    = a.image;
    document.getElementById("modalImg").alt    = a.name;
    document.getElementById("modalName").textContent = a.name;
    document.getElementById("modalMeta").textContent = `${a.type} · ${a.region}`;
    document.getElementById("modalDesc").textContent = a.description;
    const isProtected = PROTECTED.includes(a.name);
    document.getElementById("modalTags").innerHTML =
        `<span class="animal-type-badge ${badgeCls}">${a.type}</span>
         <span class="region">${a.region}</span>
         <button class="btn-book ${isProtected ? 'btn-book-disabled' : ''}"
                 id="modalBookBtn" style="margin-left:auto">
           ${isProtected ? '🔒 Захиалга хориотой' : '🏹 Захиалга хийх'}
         </button>`;

    if (!isProtected) {
        document.getElementById("modalBookBtn").addEventListener("click", () => {
            closeModal();
            openBooking(a);
        });
    }

    document.getElementById("animalModal").hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("modalClose").focus();
}

function closeModal() {
    document.getElementById("animalModal").hidden = true;
    document.body.style.overflow = "";
}

function setupEvents() {
    document.getElementById("a-search").addEventListener("input",  () => render(getFiltered()));
    document.getElementById("a-type").addEventListener("change",   () => render(getFiltered()));
    document.getElementById("a-region").addEventListener("change", () => render(getFiltered()));

    document.getElementById("modalClose").addEventListener("click", closeModal);
    document.getElementById("animalModal").addEventListener("click", e => {
        if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
}

init();
