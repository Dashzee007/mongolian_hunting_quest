const FALLBACK_IMAGE = "https://placehold.co/800x500/1a1a1a/555?text=No+Image";

async function fetchWikiImage(wikiTitle) {
    try {
        const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`;
        const res = await fetch(url);
        if (!res.ok) return FALLBACK_IMAGE;
        const data = await res.json();
        // thumbnail.source нь ажлын URL буцаана
        return data.thumbnail?.source ?? FALLBACK_IMAGE;
    } catch {
        return FALLBACK_IMAGE;
    }
}

async function fetchAnimalsFromAPI() {
    const res = await fetch("/api/animals");
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

async function fetchAnimalsFromJSON() {
    const res = await fetch("data/animals.json");
    if (!res.ok) throw new Error("JSON fallback failed");
    return res.json();
}

export async function getAnimals() {
    let animals;
    try {
        animals = await fetchAnimalsFromAPI();
    } catch {
        // file:// protocol эсвэл server унтарсан үед JSON-оос унших
        animals = await fetchAnimalsFromJSON();
    }

    // Бүх амьтанд Wikipedia зургийг зэрэг татна (Promise.all)
    const enriched = await Promise.all(
        animals.map(async (animal) => {
            const image = animal.wikiTitle
                ? await fetchWikiImage(animal.wikiTitle)
                : FALLBACK_IMAGE;
            return { ...animal, image };
        })
    );

    return enriched;
}
