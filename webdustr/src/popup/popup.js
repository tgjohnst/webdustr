// This file contains the JavaScript logic for the popup menu. It handles user interactions, such as button clicks, and communicates with the background script to manage bookmarks and user preferences.

document.addEventListener('DOMContentLoaded', function() {
    const startSwipingButton = document.getElementById('start-swiping');
    const showDiscardQueueButton = document.getElementById('show-discard-queue');
    const resetKeptSitesButton = document.getElementById('reset-kept-sites');
    const configureFoldersButton = document.getElementById('configure-folders');

    startSwipingButton.addEventListener('click', startSwiping);
    showDiscardQueueButton.addEventListener('click', showDiscardQueue);
    resetKeptSitesButton.addEventListener('click', resetKeptSites);
    configureFoldersButton.addEventListener('click', configureFolders);

    function startSwiping() {
        // Logic to start the swiping process
        browser.runtime.sendMessage({ action: 'startSwiping' });
    }

    function showDiscardQueue() {
        // Logic to show the discard queue
        browser.runtime.sendMessage({ action: 'showDiscardQueue' });
    }

    function resetKeptSites() {
        // Logic to reset kept sites
        browser.runtime.sendMessage({ action: 'resetKeptSites' });
    }

    function configureFolders() {
        // Logic to configure folders
        browser.runtime.sendMessage({ action: 'configureFolders' });
    }
});