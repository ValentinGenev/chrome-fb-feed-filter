class FeedCleaner {
    constructor(initialPosts, filters, isDebugMode) {
        this.initialPosts = initialPosts
        this.filters = filters
        this.isDebugMode = isDebugMode
    }

    observe(parentNode = this.initialPosts[0].parentNode) {
        this.observer = new MutationObserver((mutationList) => {
            mutationList.forEach(m => this.clean(m.addedNodes))
        })
        this.observer.observe(parentNode, { childList: true })
    }

    clean(posts = this.initialPosts) {
        posts.forEach(post => {
            this.filters.forEach(f => {
                if (post.innerHTML.indexOf(f) !== -1) {
                    this.isDebugMode ? post.style.width = '50%' : post.style.display = 'none'
                    console.info('FB-FEED-FILTER:', 'post hidden')
                }
            })
        })
    }

    stopObserving() {
        this.observer.disconnect()
    }
}