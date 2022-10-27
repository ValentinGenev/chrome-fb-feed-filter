const SETTINGS_FORM = document.querySelector('form#request_data')

SETTINGS_FORM.addEventListener('submit', event => {
    event.preventDefault()

    chrome.storage.local.set({
        filters: event.target.filters.value
    })

    window.close()
})

chrome.storage.local.get(['filters', 'suggestions'], ({ filters, suggestions }) => {
    SETTINGS_FORM.filters.value = filters
})