// This file contains the background script for the extension. It handles events such as bookmark access and manages the overall state of the extension.

const bookmarkAccess = async () => {
    try {
        const bookmarks = await browser.bookmarks.getTree();
        return bookmarks;
    } catch (error) {
        console.error("Error accessing bookmarks:", error);
    }
};

const onBookmarkChanged = (id, changeInfo) => {
    console.log(`Bookmark changed: ${id}`, changeInfo);
};

const handleMessages = (message, sender, sendResponse) => {
    switch (message.action) {
        case 'getBookmarks':
            bookmarkAccess().then(bookmarks => {
                sendResponse({ bookmarks: flattenBookmarks(bookmarks) });
            });
            return true; // Keep the message channel open for sendResponse
        case 'keepBookmark':
            keepBookmark(message.bookmark);
            break;
        case 'discardBookmark':
            discardBookmark(message.bookmark);
            break;
        case 'startSwiping':
            browser.tabs.create({ url: '/swipe/swipe.html' });
            break;
        case 'showDiscardQueue':
            browser.tabs.create({ url: '/discardQueue/discardQueue.html' });
            break;
        case 'resetKeptSites':
            browser.storage.local.remove('keptBookmarks');
            break;
        case 'configureFolders':
            browser.tabs.create({ url: '/configureFolders/configureFolders.html' });
            break;
        default:
            console.error('Unknown action:', message.action);
    }
};

const flattenBookmarks = (bookmarks) => {
    let flatBookmarks = [];
    const flatten = (nodes) => {
        for (let node of nodes) {
            if (node.url) {
                flatBookmarks.push({ id: node.id, title: node.title, url: node.url });
            }
            if (node.children) {
                flatten(node.children);
            }
        }
    };
    flatten(bookmarks);
    return flatBookmarks;
};

const keepBookmark = async (bookmark) => {
    try {
        let { keptBookmarks } = await browser.storage.local.get('keptBookmarks');
        keptBookmarks = keptBookmarks || [];
        keptBookmarks.push(bookmark);
        await browser.storage.local.set({ keptBookmarks });
        console.log('Bookmark kept:', bookmark);
    } catch (error) {
        console.error('Error keeping bookmark:', error);
    }
};

const discardBookmark = async (bookmark) => {
    try {
        let { discardQueue } = await browser.storage.local.get('discardQueue');
        discardQueue = discardQueue || [];
        discardQueue.push(bookmark);
        await browser.storage.local.set({ discardQueue });
        console.log('Bookmark discarded:', bookmark);
    } catch (error) {
        console.error('Error discarding bookmark:', error);
    }
};

const init = () => {
    browser.bookmarks.onCreated.addListener(onBookmarkChanged);
    browser.bookmarks.onRemoved.addListener(onBookmarkChanged);
    browser.bookmarks.onChanged.addListener(onBookmarkChanged);
    browser.runtime.onMessage.addListener(handleMessages);
};

init();