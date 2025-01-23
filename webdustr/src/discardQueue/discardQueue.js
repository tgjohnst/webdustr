document.addEventListener('DOMContentLoaded', () => {
    const discardList = document.getElementById('discard-list');
    const clearAllButton = document.getElementById('clear-all');
    const deleteAllButton = document.getElementById('delete-all');

    function loadDiscardQueue() {
        browser.storage.local.get('discardQueue').then(result => {
            const discardQueue = result.discardQueue || [];
            discardQueue.forEach((bookmark, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${bookmark.title} - <a href="${bookmark.url}" target="_blank">${bookmark.url}</a></span>
                    <button data-index="${index}" class="remove">Remove from Queue</button>
                    <button data-id="${bookmark.id}" class="delete">Delete Bookmark</button>
                `;
                discardList.appendChild(listItem);
            });

            // Add event listeners to remove and delete buttons
            document.querySelectorAll('button.remove').forEach(button => {
                button.addEventListener('click', removeBookmark);
            });
            document.querySelectorAll('button.delete').forEach(button => {
                button.addEventListener('click', deleteBookmark);
            });
        }).catch(error => {
            console.error('Error loading discard queue:', error);
        });
    }

    function removeBookmark(event) {
        const index = event.target.getAttribute('data-index');
        browser.storage.local.get('discardQueue').then(result => {
            let discardQueue = result.discardQueue || [];
            discardQueue.splice(index, 1);
            browser.storage.local.set({ discardQueue }).then(() => {
                // Reload the discard queue
                discardList.innerHTML = '';
                loadDiscardQueue();
            });
        }).catch(error => {
            console.error('Error removing bookmark:', error);
        });
    }

    function deleteBookmark(event) {
        const id = event.target.getAttribute('data-id');
        browser.bookmarks.remove(id).then(() => {
            // Remove the bookmark from the discard queue
            browser.storage.local.get('discardQueue').then(result => {
                let discardQueue = result.discardQueue || [];
                discardQueue = discardQueue.filter(bookmark => bookmark.id !== id);
                browser.storage.local.set({ discardQueue }).then(() => {
                    // Reload the discard queue
                    discardList.innerHTML = '';
                    loadDiscardQueue();
                });
            });
        }).catch(error => {
            console.error('Error deleting bookmark:', error);
        });
    }

    function clearAll() {
        browser.storage.local.remove('discardQueue').then(() => {
            discardList.innerHTML = '';
        }).catch(error => {
            console.error('Error clearing discard queue:', error);
        });
    }

    function deleteAll() {
        if (confirm('Are you sure you want to delete all bookmarks in the discard queue?')) {
            browser.storage.local.get('discardQueue').then(result => {
                const discardQueue = result.discardQueue || [];
                const deletePromises = discardQueue.map(bookmark => browser.bookmarks.remove(bookmark.id));
                Promise.all(deletePromises).then(() => {
                    clearAll();
                }).catch(error => {
                    console.error('Error deleting all bookmarks:', error);
                });
            });
        }
    }

    clearAllButton.addEventListener('click', clearAll);
    deleteAllButton.addEventListener('click', deleteAll);

    loadDiscardQueue();
});