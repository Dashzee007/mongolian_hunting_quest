import { getAnimals } from "./api.js";

const REGION_COORDS = {
    "Хангай":      [47.5, 100.5],
    "Алтай":       [46.5, 91.0],
    "Говь":        [44.0, 104.0],
    "Говь-Алтай":  [46.0, 96.0],
    "Хэнтий":      [47.8, 109.5],
    "Дархад":      [51.0, 99.5],
    "Увс":         [50.0, 92.5],
    "Хөвсгөл":    [50.5, 100.5],
    "Сэлэнгэ":    [49.5, 103.5],
    "Завхан":      [48.0, 96.5],
    "Дорнод":      [47.5, 115.5],
    "Баянхонгор":  [46.0, 100.0],
    "Орхон":       [47.7, 103.0],
    "Сүхбаатар":  [46.5, 113.5],
    "Говьсүмбэр":  [46.5, 108.0],
    "Булган":      [48.5, 103.0],
    "Дархан-Уул":  [49.5, 105.9],
    "Төв":         [47.5, 106.5],
};

const TYPE_COLOR = {
    "Хөхтөн":       "#40916c",
    "Шувуу":         "#3b82f6",
    "Холимог идэшт": "#f59e0b",
};

const TYPE_EMOJI = {
    "Хөхтөн":       "🦌",
    "Шувуу":         "🦅",
    "Холимог идэшт": "🐻",
};

// Custom SVG pin marker
function makeMarker(type, count) {
    const color = TYPE_COLOR[type] || "#40916c";
    const size  = count > 5 ? 44 : 36;
    const html  = `
        <div style="
            width:${size}px; height:${size}px;
            background:${color};
            border:3px solid #fff;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:0 4px 14px rgba(0,0,0,.3);
            display:flex; align-items:center; justify-content:center;
        ">
            <span style="transform:rotate(45deg); font-size:${size > 40 ? 17 : 14}px; line-height:1;">
                ${TYPE_EMOJI[type] || "📍"}
            </span>
        </div>`;
    return L.divIcon({
        html,
        className: "",
        iconSize:   [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor:[0, -(size + 4)],
    });
}

// Dominant type in a list
function dominantType(list) {
    const counts = list.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

async function init() {
    const animals = await getAnimals();

    // Group by region (reduce)
    const byRegion = animals.reduce((acc, a) => {
        (acc[a.region] = acc[a.region] || []).push(a);
        return acc;
    }, {});

    // CartoDB Positron — clean light tiles like Google Maps
    const map = L.map("map", {
        center:         [46.8, 103.8],
        zoom:           5,
        minZoom:        4,
        maxZoom:        14,
        zoomControl:    false,
    });

    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { attribution: '© <a href="https://carto.com/">CARTO</a> | © OpenStreetMap contributors' }
    ).addTo(map);

    // Zoom controls — bottom right like Google Maps
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // ── Build markers ──────────────────────────────────────────
    const markers = {};

    Object.entries(byRegion).forEach(([region, list]) => {
        const coords = REGION_COORDS[region];
        if (!coords) return;

        const dtype = dominantType(list);

        // Popup HTML
        const popupHtml = `
            <div class="map-popup">
                <h3>${region}</h3>
                <p class="popup-count">📍 ${list.length} амьтан бүртгэлтэй</p>
                <ul>
                    ${list.slice(0, 6).map(a =>
                        `<li>${TYPE_EMOJI[a.type] || ""} ${a.name} <em>${a.type}</em></li>`
                    ).join("")}
                    ${list.length > 6 ? `<li style="color:var(--text-muted)">… өөр ${list.length - 6}</li>` : ""}
                </ul>
            </div>`;

        const marker = L.marker(coords, { icon: makeMarker(dtype, list.length) })
            .addTo(map)
            .bindPopup(popupHtml, { maxWidth: 260, closeButton: false });

        marker.on("click", () => openDetail(region, list, marker, map));
        markers[region] = { marker, list };
    });

    // ── Sidebar region list ────────────────────────────────────
    const regionList = document.getElementById("regionList");
    const sortedRegions = Object.entries(byRegion).sort((a, b) => b[1].length - a[1].length);

    regionList.innerHTML = sortedRegions.map(([region, list]) => {
        const coords  = REGION_COORDS[region];
        const dtype   = dominantType(list);
        const color   = TYPE_COLOR[dtype] || "#40916c";
        const counts  = list.reduce((acc, a) => { acc[a.type] = (acc[a.type]||0)+1; return acc; }, {});
        const badges  = Object.entries(counts)
            .map(([t, n]) => `<span class="region-badge" style="background:${TYPE_COLOR[t]}">${TYPE_EMOJI[t]} ${n}</span>`)
            .join("");

        return `
            <li class="region-item ${!coords ? "region-no-coords" : ""}"
                data-region="${region}" role="button" tabindex="${coords ? 0 : -1}"
                aria-label="${region} бүс рүү шилжих">
                <span class="region-dot" style="background:${color}"></span>
                <div class="region-info">
                    <span class="region-name">${region}</span>
                    <span class="region-count">${list.length} амьтан</span>
                </div>
                <div class="region-badges">${badges}</div>
            </li>`;
    }).join("");

    // Click on sidebar item
    regionList.querySelectorAll(".region-item:not(.region-no-coords)").forEach(item => {
        const handler = () => {
            const r    = item.dataset.region;
            const data = markers[r];
            if (!data) return;

            map.flyTo(data.marker.getLatLng(), 8, { duration: 1.2, easeLinearity: 0.25 });

            setTimeout(() => {
                data.marker.openPopup();
                openDetail(r, data.list, data.marker, map);
            }, 900);

            regionList.querySelectorAll(".region-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // Mobile: collapse panel after selecting
            if (window.innerWidth <= 480) {
                document.getElementById("gmapPanel").classList.remove("mobile-open");
            }
        };
        item.addEventListener("click", handler);
        item.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") handler(); });
    });

    // ── Region search filter ───────────────────────────────────
    document.getElementById("regionSearch").addEventListener("input", function () {
        const q = this.value.toLowerCase();
        regionList.querySelectorAll(".region-item").forEach(item => {
            const match = item.dataset.region.toLowerCase().includes(q);
            item.style.display = match ? "" : "none";
        });
    });

    // ── Detail panel close ─────────────────────────────────────
    document.getElementById("detailClose").addEventListener("click", () => {
        document.getElementById("gmapDetail").classList.remove("open");
        map.closePopup();
    });

    // ── Mobile panel toggle ────────────────────────────────────
    document.getElementById("panelToggle").addEventListener("click", () => {
        document.getElementById("gmapPanel").classList.toggle("mobile-open");
    });

    // Close panel when clicking map on mobile
    map.on("click", () => {
        if (window.innerWidth <= 480) {
            document.getElementById("gmapPanel").classList.remove("mobile-open");
        }
    });
}

function openDetail(region, list, marker, map) {
    document.getElementById("detailRegion").textContent = region;

    const counts = list.reduce((acc, a) => { acc[a.type] = (acc[a.type]||0)+1; return acc; }, {});

    document.getElementById("detailBody").innerHTML = `
        <div class="gmap-detail-stat">
            <span>Нийт амьтан</span>
            <span>${list.length}</span>
        </div>
        ${Object.entries(counts).map(([t, n]) => `
        <div class="gmap-detail-stat">
            <span>${TYPE_EMOJI[t]} ${t}</span>
            <span>${n}</span>
        </div>`).join("")}
        <div class="gmap-detail-animals">
            ${list.map(a => `
            <div class="mini-card">
                <img src="${a.image}" alt="${a.name}"
                     onerror="this.style.visibility='hidden'">
                <div>
                    <div class="mini-card-name">${a.name}</div>
                    <div class="mini-card-type">${TYPE_EMOJI[a.type]} ${a.type}</div>
                </div>
            </div>`).join("")}
        </div>`;

    document.getElementById("gmapDetail").classList.add("open");

    // Highlight active sidebar item
    document.querySelectorAll(".region-item").forEach(i => i.classList.remove("active"));
    const activeItem = document.querySelector(`.region-item[data-region="${region}"]`);
    if (activeItem) {
        activeItem.classList.add("active");
        activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
}

init();
