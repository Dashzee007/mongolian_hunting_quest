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

export async function getAnimals() {
    const res = await fetch("../data/animals.json");
    const animals = await res.json();

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
