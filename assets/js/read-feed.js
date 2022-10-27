const SELECTORS = {
    posts: '[data-pagelet*="FeedUnit"]'
}
let FILTERS = {}

chrome.storage.local.get(
    ['filters'],
    filters => {
        FILTERS['filters'] = filters['filters']
        const firstPosts = document.querySelectorAll(SELECTORS.posts)
        hidePosts(firstPosts)
        filterNewPosts(firstPosts[0]?.parentNode)
    }
)

function filterNewPosts(postsWrapper) {
    const observer = new MutationObserver((mutationList) => {
        mutationList.forEach(mutation => hidePosts(mutation.addedNodes))
    })

    observer.observe(postsWrapper, { childList: true })
}

function hidePosts(posts) {
    posts.forEach(post => {
        const content = post.innerHTML
        const filters = getFilters()

        filters.forEach(filter => {
            if (content.indexOf(filter) !== -1) {
                post.style.display = 'none'
                console.log('sod off...')
            }
        })
    })
}

function getFilters() {
    return FILTERS.filters ?
        FILTERS.filters.split(',').map(poster => poster.trim()) : []
}