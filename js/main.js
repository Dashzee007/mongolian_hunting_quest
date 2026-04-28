import { getAnimals } from "./api.js";
import { displayAnimals, showLoading } from "./ui.js";

let animals    = [];
let suggestions;
let activeIndex = -1;

async function init() {
    showLoading("animalList");
    animals     = await getAnimals();
    suggestions = document.getElementById("suggestions");

    displayAnimals(animals);
    setupCardClicks();
    setupEvents();
}

// ── Card click → open animals page (navigates with name query) ──
function setupCardClicks() {
    const grid = document.getElementById("animalList");
    grid.addEventListener("click", e => {
        if (e.target.closest(".btn-book")) return;
        const card = e.target.closest(".animal-card");
        if (!card) return;
        window.location.href = `animals.html`;
    });
}

function setupEvents() {
    const searchInput = document.getElementById("search");
    const typeSelect  = document.getElementById("type");

    searchInput.addEventListener("input",   filterData);
    searchInput.addEventListener("keydown", handleSuggestionKeys);
    typeSelect.addEventListener("change",   filterData);

    document.addEventListener("click", event => {
        if (!event.target.closest(".search-bar")) hideSuggestions();
    });

    document.querySelector(".search-btn")?.addEventListener("click", filterData);
}

function filterData() {
    const searchValue     = document.getElementById("search").value.toLowerCase();
    const type            = document.getElementById("type").value;
    const resultsSection  = document.querySelector(".results-section");

    const filtered = animals.filter(a => {
        const matchName = a.name.toLowerCase().includes(searchValue);
        const matchType = type === "all" || a.type === type;
        return matchName && matchType;
    });

    updateSuggestions(searchValue, type);

    const isActive = searchValue !== "" || type !== "all";
    resultsSection.classList.toggle("search-active", isActive);

    displayAnimals(isActive ? filtered : animals);

    if (isActive) setupCardClicks();
}

function updateSuggestions(searchValue, type) {
    if (!searchValue) { hideSuggestions(); return; }

    const list = animals
        .filter(a =>
            a.name.toLowerCase().includes(searchValue) &&
            (type === "all" || a.type === type)
        )
        .map(a => a.name)
        .filter((v, i, self) => self.indexOf(v) === i)
        .slice(0, 6);

    if (!list.length) { hideSuggestions(); return; }

    suggestions.innerHTML = list.map(name => `<li role="option">${name}</li>`).join("");
    suggestions.style.display = "block";
    activeIndex = -1;

    suggestions.querySelectorAll("li").forEach(item => {
        item.addEventListener("click", () => {
            document.getElementById("search").value = item.textContent;
            filterData();
            hideSuggestions();
        });
    });
}

function hideSuggestions() {
    suggestions.innerHTML      = "";
    suggestions.style.display  = "none";
    activeIndex                = -1;
}

function handleSuggestionKeys(event) {
    if (!suggestions || suggestions.style.display !== "block") return;
    const items = Array.from(suggestions.querySelectorAll("li"));
    if (!items.length) return;

    if (event.key === "ArrowDown") {
        event.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
    } else if (event.key === "Enter") {
        const active = items[activeIndex];
        if (active) {
            event.preventDefault();
            document.getElementById("search").value = active.textContent;
            filterData();
            hideSuggestions();
        }
        return;
    }
    items.forEach((item, i) => item.classList.toggle("active", i === activeIndex));
}

init();
