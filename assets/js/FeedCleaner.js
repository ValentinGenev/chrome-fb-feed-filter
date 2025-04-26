class FeedCleaner {
    bannedAriaLabels = ['sponsored', 'shop now', 'sign up', 'order now', 'get offer']

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
            let isPostHidden = false
            for (const filter of this.filters) {
                if (post.innerHTML.indexOf(filter) >= 0) {
                    this.hidePost(post)
                    isPostHidden = true
                    break
                }
            }

            if (!isPostHidden) {
                this.checkForBannedLabels(post)
            }
        }
    }

    async checkForBannedLabels(post) {
        if (await this.checkLabels(post)) {
            this.hidePost(post)
        }
    }

    /**
     * Finds the Sponsored label by label ID
     * @param {Node} post
     * @returns
     */
    async checkLabels(post) {
        const labelledElements = Array.from(post.querySelectorAll('span[aria-labelledby]')) ?? []
        const labelsFetch = labelledElements.map(label => {
            const labelId = label.getAttribute('aria-labelledby')
            return this.doesElementHaveBannedLabel(labelId)
        })

        return (await Promise.all(labelsFetch)).includes(true)
    }

    hidePost(post) {
        this.isDebugMode ? post.style.width = '50%' : post.style.display = 'none'
        console.info('FB-FEED-FILTER:', 'post hidden')
    }

    stopObserving() {
        this.observer.disconnect()
    }

    doesElementHaveBannedLabel(id) {
        return new Promise(async (resolve) => {
            let label = undefined
            let tries = 0
            while (!label && tries < 10000) {
                // Makes sure to wait for the label element creation.
                // A mutator would be better if it was easier to pinpoint the label elements
                await sleep(100)
                label = document.querySelector("*[id='" + id + "']")?.innerText?.toLocaleLowerCase()
                tries++
            }
            if (this.bannedAriaLabels.includes(label)) {
                resolve(true)
            }
            resolve(false)

        })
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}