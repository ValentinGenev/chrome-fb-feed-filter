chrome.storage.local.get(
    ['filters', 'selector', 'debugMode'],
    ({ filters, selector, debugMode }) => {
        const cleaner = new FeedCleaner(document.querySelectorAll(selector),
                                        filters.split(',').map(poster => poster.trim()),
                                        debugMode)
        cleaner.clean()
        cleaner.observe()
        const observer = new FeedObserver(document.querySelector('div[role="progressbar"]'),
                                          cleaner)
        observer.observe(document.querySelectorAll(selector)[0].parentNode)
    }
)