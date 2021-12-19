const SETTINGS_FORM = document.querySelector('form#request_data')

SETTINGS_FORM.addEventListener('submit', event => {
    event.preventDefault()
    
    chrome.storage.local.set({ 
        posters: event.target.posters.value,
        suggestions: event.target.suggestions.checked
    })
    
    window.close()
})

chrome.storage.local.get(['posters', 'suggestions'], ({ posters, suggestions }) => {
    SETTINGS_FORM.posters.value = posters
    SETTINGS_FORM.suggestions.checked = Boolean(suggestions)
})