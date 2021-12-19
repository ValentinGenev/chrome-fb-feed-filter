const SETTINGS_FORM = document.querySelector('form#request_data')

/**
 * Stores user specific data in the local storage
 */
SETTINGS_FORM.addEventListener('submit', event => {
    event.preventDefault()
    
    chrome.storage.local.set({ posters: event.target.posters.value || false })
    
    window.close()
})

/**
 * Pre-populates the settings form
 */
chrome.storage.local.get('posters', ({ posters }) => {
    SETTINGS_FORM.posters.value = posters ? posters : ''
})