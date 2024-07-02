chrome.storage.local.get(
    ['filters', 'selector'],
    s => {
        const cleaner = new FeedCleaner(s)
        cleaner.clean()
        cleaner.observe()
    }
)

class FeedCleaner {
    constructor(settings) {
        this.settings = settings
        this.initialPosts = document.querySelectorAll(settings.selector)
        this.filters = settings.filters.split(',').map(poster => poster.trim())
    }

    observe() {
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach(mutation => this.clean(mutation.addedNodes))
        })

        observer.observe(this.initialPosts[0].parentNode, { childList: true })
    }

    clean(posts = this.initialPosts) {
        posts.forEach(post => {
            this.filters.forEach(filter => {
                if (post.innerHTML.indexOf(filter) !== -1) {
                    post.style.display = 'none'
                    console.info('FB-FEED-FILTER:', 'post hidden')
                }
            })
        })
    }
}