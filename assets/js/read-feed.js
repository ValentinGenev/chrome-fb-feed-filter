const SELECTORS = {
    feed: '[role="feed"]',
    posts: '[data-pagelet*="FeedUnit"]'
}
const FILTERS = {}
// TODO: add hidden posts counter

chrome.storage.local.get(
    ['posters', 'suggestions'],
    filters => { 
        for (const type in filters) {
            FILTERS[type] = filters[type]
        }

        filterFirstPost()
        startFiltering()
    }
)

function filterFirstPost() {
    filterPosts(document.querySelectorAll(SELECTORS.posts))
}

function startFiltering() {
    const feed = document.querySelector(SELECTORS.feed)
    const observer = new MutationObserver((mutationList) => {
        mutationList.forEach(mutation => filterPosts(mutation.addedNodes))
    })

    observer.observe(feed, { childList: true })
}

function filterPosts(posts) {
    posts.forEach(post => {
        hideByPoster(post) || hideIfSuggestion(post) && alertIfPostHidden()
    })
}

function hideByPoster(post) {
    const content = post.innerHTML
    const posters = getPosters()
    let wasHidden = false

    posters.forEach(poster => {
        if (content.indexOf(poster) !== -1) {
            post.style.display = 'none'
            wasHidden = true
        }
    })

    return wasHidden
}

function getPosters() {
    return FILTERS.posters ?
        FILTERS.posters.split(',').map(poster => poster.trim()) : []
}

function hideIfSuggestion(post) {
    const content = post.innerHTML
    let wasHidden = false

    if (content.indexOf('Suggested for you') !== -1) {
        post.style.display = 'none'
        wasHidden = true
    }

    return wasHidden
}

function alertIfPostHidden() {
    console.log('Post hidden.')
}