// This file contains the JavaScript logic for the swipe overlay. It implements the swiping functionality, handling the logic for keeping or discarding bookmarks based on user gestures.

document.addEventListener('DOMContentLoaded', () => {
    const swipeContainer = document.getElementById('swipe-container');
    const swipeTitle = document.getElementById('swipe-title');
    const swipeUrl = document.getElementById('swipe-url');
    const bookmarkFrame = document.getElementById('bookmark-frame');
    const remainingCount = document.getElementById('bookmark-counter');
    const folderSelect = document.getElementById('folder-select');
    const warningFlag = document.getElementById('warning-flag');
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

    function loadBookmarks(folderId) {
        // Fetch bookmarks from background script
        browser.runtime.sendMessage({ action: 'getBookmarks' }).then(response => {
            const allBookmarks = response.bookmarks;
            bookmarks = getBookmarksFromFolder(allBookmarks, folderId);
            shuffleArray(bookmarks);
            updateRemainingCount();
            displayCurrentBookmark();
        });
    }

    function getBookmarksFromFolder(bookmarks, folderId) {
        let folderBookmarks = [];
        const findFolder = (nodes) => {
            for (let node of nodes) {
                if (node.id === folderId) {
                    folderBookmarks = node.children || [];
                    return;
                }
                if (node.children) {
                    findFolder(node.children);
                }
            }
        };
        findFolder(bookmarks);
        return folderBookmarks;
    }

    function displayCurrentBookmark() {
        if (currentIndex < bookmarks.length) {
            const bookmark = bookmarks[currentIndex];
            // Display bookmark details in the swipe overlay
            swipeTitle.textContent = bookmark.title;
            swipeUrl.innerHTML = `<a href="${bookmark.url}" target="_blank">${bookmark.url}</a>`;
            warningFlag.style.display = 'none'; // Hide warning flag initially
            bookmarkFrame.src = bookmark.url;
        } else {
            swipeContainer.innerHTML = '<h2>No more bookmarks</h2>';
        }
    }

    bookmarkFrame.addEventListener('load', () => {
        // Check if the iframe loaded successfully
        if (bookmarkFrame.contentDocument && bookmarkFrame.contentDocument.title === '404 Not Found') {
            warningFlag.style.display = 'inline'; // Show warning flag if 404 error
        }
    });

    bookmarkFrame.addEventListener('error', () => {
        warningFlag.style.display = 'inline'; // Show warning flag if error loading iframe
    });

    function populateFolderSelect(bookmarks) {
        const folderOptions = [];
        const traverseBookmarks = (nodes, path = '') => {
            for (let node of nodes) {
                if (node.children) {
                    const fullPath = path ? `${path} / ${node.title}` : node.title;
                    folderOptions.push({ id: node.id, title: fullPath });
                    traverseBookmarks(node.children, fullPath);
                }
            }
        };
        traverseBookmarks(bookmarks);
        folderOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.id;
            opt.textContent = option.title;
            folderSelect.appendChild(opt);
        });
    }

    function getPath(bookmark) {
        let path = [];
        const findPath = (nodes, targetId, currentPath = []) => {
            for (let node of nodes) {
                if (node.id === targetId) {
                    path = currentPath.concat(node.title);
                    return true;
                }
                if (node.children && findPath(node.children, targetId, currentPath.concat(node.title))) {
                    return true;
                }
            }
            return false;
        };
        findPath(bookmarks, bookmark.id);
        return path.join(' / ');
    }

    folderSelect.addEventListener('change', () => {
        currentIndex = 0;
        loadBookmarks(folderSelect.value);
    });

    // Initial load of bookmarks and folder structure
    browser.runtime.sendMessage({ action: 'getBookmarks' }).then(response => {
        const allBookmarks = response.bookmarks;
        populateFolderSelect(allBookmarks);
        if (folderSelect.options.length > 0) {
            loadBookmarks(folderSelect.value);
        }
    });

    document.getElementById('swipe-left').addEventListener('click', () => {
        // Logic to discard the bookmark
        browser.runtime.sendMessage({ action: 'discardBookmark', bookmark: bookmarks[currentIndex] });
        currentIndex++;
        updateRemainingCount();
        displayCurrentBookmark();
    });

    document.getElementById('swipe-right').addEventListener('click', () => {
        // Logic to keep the bookmark
        browser.runtime.sendMessage({ action: 'keepBookmark', bookmark: bookmarks[currentIndex] });
        currentIndex++;
        updateRemainingCount();
        displayCurrentBookmark();
    });
});