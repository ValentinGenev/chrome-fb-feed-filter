const SETTINGS_FORM = document.querySelector('form#request_data')

SETTINGS_FORM.addEventListener('submit', event => {
    event.preventDefault()

    chrome.storage.local.set({
        filters: event.target.filters.value,
        selector: event.target.selector.value
    })

    window.close()
})

chrome.storage.local.get(['filters', 'selector'], ({ filters, selector }) => {
    SETTINGS_FORM.filters.value = filters
    SETTINGS_FORM.selector.value = selector
})