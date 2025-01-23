// This file contains the JavaScript logic for the swipe overlay. It implements the swiping functionality, handling the logic for keeping or discarding bookmarks based on user gestures.

document.addEventListener('DOMContentLoaded', () => {
    const swipeContainer = document.getElementById('swipe-container');
    const swipeTitle = document.getElementById('swipe-title');
    const swipeUrl = document.getElementById('swipe-url');
    const bookmarkFrame = document.getElementById('bookmark-frame');
    const remainingCount = document.getElementById('bookmark-counter');
    let bookmarks = [];
    let currentIndex = 0;

    function updateRemainingCount() {
        remainingCount.textContent = `Bookmarks remaining: ${bookmarks.length - currentIndex}`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function loadBookmarks() {
        // Fetch bookmarks from background script
        browser.runtime.sendMessage({ action: 'getBookmarks' }).then(response => {
            bookmarks = response.bookmarks;
            shuffleArray(bookmarks);
            updateRemainingCount();
            displayCurrentBookmark();
        });
    }

    function displayCurrentBookmark() {
        if (currentIndex < bookmarks.length) {
            const bookmark = bookmarks[currentIndex];
            // Display bookmark details in the swipe overlay
            swipeTitle.textContent = bookmark.title;
            swipeUrl.innerHTML = `<a href="${bookmark.url}" target="_blank">${bookmark.url}</a>`;
            bookmarkFrame.src = bookmark.url;
        } else {
            swipeContainer.innerHTML = '<h2>No more bookmarks</h2>';
        }
    }

    function swipeRight() {
        // Logic to keep the bookmark
        browser.runtime.sendMessage({ action: 'keepBookmark', bookmark: bookmarks[currentIndex] });
        currentIndex++;
        updateRemainingCount();
        displayCurrentBookmark();
    }

    function swipeLeft() {
        // Logic to discard the bookmark
        browser.runtime.sendMessage({ action: 'discardBookmark', bookmark: bookmarks[currentIndex] });
        currentIndex++;
        updateRemainingCount();
        displayCurrentBookmark();
    }

    function skipBookmark() {
        // Logic to skip the bookmark
        currentIndex++;
        updateRemainingCount();
        displayCurrentBookmark();
    }

    // Event listeners for swipe actions
    document.getElementById('swipe-right').addEventListener('click', swipeRight);
    document.getElementById('swipe-left').addEventListener('click', swipeLeft);
    document.getElementById('swipe-center').addEventListener('click', skipBookmark);

    loadBookmarks();
});