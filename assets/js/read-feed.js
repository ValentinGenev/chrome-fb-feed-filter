let settings

chrome.storage.local.get(
    ['filters', 'selector'],
    s => {
        settings = s
        const firstPosts = document.querySelectorAll(settings.selector)
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
                console.info('FB-FEED-FILTER:', 'post hidden')
            }
        })
    })
}

function getFilters() {
    return settings.filters ?
        settings.filters.split(',').map(poster => poster.trim()) : []
}