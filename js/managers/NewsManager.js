class NewsManager {
    constructor() {
        console.log("NewsManager initialized (Bridged to new UI)");
    }

    init() {
        // No-op: Visuals handled by index.html now
    }

    addNews(text, color = 'white') {
        if (window.addNews) {
            window.addNews(text, color);
        } else {
            console.log(`[NEWS_BACKUP] ${text}`);
        }
    }

    // Deprecated methods kept for safety
    nextNews() { }
    updateTicker() { }
}

window.newsManager = new NewsManager();

