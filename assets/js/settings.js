const SETTINGS_FORM = document.querySelector('form#request_data')

SETTINGS_FORM.addEventListener('submit', event => {
    event.preventDefault()

    chrome.storage.local.set({
        filters: event.target.filters.value,
        selector: event.target.selector.value,
        debugMode: event.target.debugMode.checked
    })

    window.close()
})

chrome.storage.local.get(['filters', 'selector', 'debugMode'], ({ filters, selector, debugMode }) => {
    SETTINGS_FORM.filters.value = filters
    SETTINGS_FORM.selector.value = selector
    SETTINGS_FORM.debugMode.checked = debugMode
})