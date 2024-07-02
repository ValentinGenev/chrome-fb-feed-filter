class FeedObserver {
    constructor(progressBar, feedCleaner) {
        this.progressBar = progressBar
        this.feedCleaner = feedCleaner
    }

    observe(parentNode) {
        this.observer = new MutationObserver((mutationList) => {
            mutationList.forEach(_m => {
                this.feedCleaner.stopObserving()
                this.feedCleaner.observe(parentNode)
            })
        })

        this.observer.observe(this.progressBar, { attributes: true })
    }
}