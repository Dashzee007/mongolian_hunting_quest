import { getAnimals } from "./api.js";

let allAnimals = [];
let filtered = [];
let currentIndex = 0;

function showGalleryLoading() {
    document.getElementById("galleryGrid").innerHTML = Array.from({ length: 8 }, () => `
        <div class="gallery-item" style="cursor:default">
            <div class="skeleton-pulse" style="width:100%;height:100%;background:#222;border-radius:14px"></div>
        </div>
    `).join("");
}

async function init() {
    showGalleryLoading();
    allAnimals = await getAnimals();
    filtered = allAnimals;
    render(filtered);
    setupTabs();
    setupLightbox();
}

function render(list) {
    const grid = document.getElementById("galleryGrid");

    if (!list.length) {
        grid.innerHTML = `<p class="no-results">Зураг олдсонгүй.</p>`;
        return;
    }

    grid.innerHTML = list
        .map((a, i) => `
            <div class="gallery-item" data-index="${i}" role="button" tabindex="0" aria-label="${a.name} томруулах">
                <img src="${a.image}" alt="${a.name}" loading="lazy">
                <div class="gallery-overlay">
                    <span class="gallery-name">${a.name}</span>
                    <span class="gallery-type">${a.type}</span>
                </div>
            </div>
        `)
        .join("");

    grid.querySelectorAll(".gallery-item").forEach(item => {
        item.addEventListener("click", () => openLightbox(Number(item.dataset.index)));
        item.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") openLightbox(Number(item.dataset.index));
        });
    });
}

function setupTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;
            filtered = filter === "all"
                ? allAnimals
                : allAnimals.filter(a => a.type === filter);

            render(filtered);
        });
    });
}

function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    document.getElementById("lightbox").hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("lbClose").focus();
}

function closeLightbox() {
    document.getElementById("lightbox").hidden = true;
    document.body.style.overflow = "";
}

function updateLightbox() {
    const a = filtered[currentIndex];
    document.getElementById("lbImg").src = a.image;
    document.getElementById("lbImg").alt = a.name;
    document.getElementById("lbName").textContent = a.name;
    document.getElementById("lbMeta").textContent = `${a.type} · ${a.region}`;
}

function setupLightbox() {
    document.getElementById("lbClose").addEventListener("click", closeLightbox);
    document.getElementById("lbPrev").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + filtered.length) % filtered.length;
        updateLightbox();
    });
    document.getElementById("lbNext").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % filtered.length;
        updateLightbox();
    });
    document.getElementById("lightbox").addEventListener("click", e => {
        if (e.target === e.currentTarget) closeLightbox();
    });
    document.addEventListener("keydown", e => {
        const lb = document.getElementById("lightbox");
        if (lb.hidden) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") {
            currentIndex = (currentIndex + 1) % filtered.length;
            updateLightbox();
        }
        if (e.key === "ArrowLeft") {
            currentIndex = (currentIndex - 1 + filtered.length) % filtered.length;
            updateLightbox();
        }
    });
}

init();
