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
        for (const post of posts) {
            for (const filter of this.filters) {
                if (post.innerHTML.indexOf(filter) >= 0) {
                    this.hidePost(post)
                    break
                }
            }

            this.checkForLabels(post)
        }
    }

    async checkForLabels(post) {
        if (await this.hasSponsoredLabel(post)) {
            this.hidePost(post)
        }
    }

    /**
     * Finds the Sponsored label by label ID
     * @param {Node} post
     * @returns
     */
    async hasSponsoredLabel(post) {
        const labelledElements = Array.from(post.querySelectorAll('span[aria-labelledby]')) ?? []
        for (const element of labelledElements) {
            const labelId = element.getAttribute('aria-labelledby')
            let label = undefined
            let tries = 0
            while (!label && tries < 100) {
                // Makes sure to wait for the label element creation.
                // A mutator would be better if it was easier to pinpoint the label elements
                await sleep(100)
                label = document.querySelector("*[id='" + labelId + "']")?.innerText?.toLocaleLowerCase()
                tries++
                if (label === 'sponsored') {
                    return true
                }
            }
        }
        return false
    }

    hidePost(post) {
        this.isDebugMode ? post.style.width = '50%' : post.style.display = 'none'
        console.info('FB-FEED-FILTER:', 'post hidden')
    }

    stopObserving() {
        this.observer.disconnect()
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}