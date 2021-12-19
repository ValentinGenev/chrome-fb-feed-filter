const SELECTORS = {
    feed: '[role="feed"]',
}
const FILTERS = {}

chrome.storage.local.get(
    ['posters'],
    filters => { 
        for (const type in filters) {
            FILTERS[type] = filters[type]
        }

        startFiltering()
    }
)

function startFiltering() {
    const feed = document.querySelector(SELECTORS.feed)
    const observer = new MutationObserver((mutationList) => {
        mutationList.forEach(mutation => filterPosts(mutation.addedNodes))
    })

    observer.observe(feed, { childList: true })
}

function filterPosts(posts) {
    // TODO: add more types of filters. For example: suggestions
    posts.forEach(post => hideByPoster(post))
}

function hideByPoster(post) {
    const content = post.innerHTML
    const posters = getPosters()
    let wasHidden = false

    posters.forEach(poster => {
        if (content.indexOf(poster) > -1) {
            // TODO: display = none might cause issues, hide in different manner
            post.style.display = 'none'
            wasHidden = true
        }
    })

    return wasHidden
}

function getPosters() {
    return FILTERS.posters.split(',').map(poster => poster.trim())
}