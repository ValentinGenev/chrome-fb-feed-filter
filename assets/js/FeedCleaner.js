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
     * @param {HTMLElement} post
     * @returns
     */
    async checkLabels(post) {
        const labelledElements = Array.from(post.querySelectorAll('span[aria-labelledby]')) ?? []
        let labelChecks = labelledElements.map(label => {
            const labelId = label.getAttribute('aria-labelledby')
            return new Promise(async (resolve) => {
                const labeledElement = await getElementByIdWithRetries(labelId)
                if (labeledElement) {
                    const label = labeledElement.innerText.toLocaleLowerCase()
                    if (this.bannedAriaLabels.includes(label)) {
                        resolve(true)
                    }
                }
                resolve(false)
            })
        })

        const hasBannedLabel = (await Promise.all(labelChecks)).includes(true)
        labelChecks = null
        return hasBannedLabel
    }

    hidePost(post) {
        this.isDebugMode ? post.style.width = '50%' : post.style.display = 'none'
        console.info('FB-FEED-FILTER:', 'post hidden')
    }

    stopObserving() {
        this.observer.disconnect()
    }
}

/**
 * Repeatedly tries to get an HTML DOM element by its ID every 100ms, up to 100 retries.
 * @param {string} id - The ID of the DOM element to retrieve.
 * @returns {Promise<HTMLElement|null>} - Resolves with the element if found, or null if not found after retries.
 */
async function getElementByIdWithRetries(id) {
    let retries = 0;

    while (retries < 300) {
        const element = document.getElementById(id);
        if (element) {
            return element;
        }
        await sleep(100);
        retries++;
    }

    return null;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}