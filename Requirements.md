I.  Requirements Description

    Name: webdustr
    Purpose: To help users efficiently review and manage their Firefox bookmarks by providing a Tinder-like "swipe" interface for keeping or discarding bookmarks.
    Core Functionality:
        Bookmark Access: Read and modify user's bookmarks (with necessary permissions).
        User Interface:
            Browser Action Button: Opens the extension's main menu.
            Menu Options:
                Start Swiping
                Show Discard Queue
                Reset Kept Sites
                Configure Folders
            Swipe Overlay: An overlay that appears on top of the current webpage for the swiping interaction.
        Swiping Logic:
            "Swipe Right" (Keep): Marks the bookmark as "kept" to prevent it from reappearing in future swiping sessions.
            "Swipe Left" (Discard): Adds the bookmark to a discard queue.
            Bookmark Counter: Displays the number of remaining (unseen) bookmarks in the current session.
        Data Storage:
            Store user preferences (e.g., selected folders, kept bookmarks).
            Maintain a discard queue.

II.  Development Plan

    Project Setup:
        Create a new Firefox extension project directory.
        Set up the basic extension files (manifest.json, popup.html, popup.js, etc.).

    User Interface (UI) Development:
        Menu Design: Create the HTML structure for the extension menu (popup) with the required buttons (Start Swiping, Show Discard Queue, Reset Kept Sites, Configure Folders).
        Swipe Overlay Design: Design the HTML for the swipe overlay, including buttons/gestures for swiping left and right, and an element to display the remaining bookmark count.
        Styling: Use CSS to style the menu and overlay to match your desired look and feel.

    Core Functionality Implementation:
        Bookmark Interaction:
            Use the Firefox browser APIs (browser.bookmarks) to:
                Get a list of bookmarks (from selected folders).
                Mark bookmarks as "kept."
                Move bookmarks to the discard queue.
            Implement the swiping logic (left/right actions).
        Data Management:
            Use browser storage APIs (browser.storage.local) to store:
                User-selected folders for swiping.
                List of "kept" bookmarks.
                The discard queue.

    Configure Folders Feature:
        Create a user interface within the extension popup to:
            Display a list of the user's bookmark folders.
            Allow the user to select/deselect folders for inclusion in the swiping process.
            Save the user's folder selections.

    Show Discard Queue Feature:
        Create a user interface to display the bookmarks in the discard queue.
        Add a "Discard" button to remove the bookmarks from the user's bookmarks.

    Reset Kept Sites Feature:
        Implement the functionality to clear the list of "kept" bookmarks, allowing all bookmarks to reappear in future swiping sessions.

    Testing and Refinement:
        Thoroughly test the extension in Firefox.
        Debug and fix any issues.
        Refine the UI and user experience based on testing feedback.

III.  Technology Stack

    HTML: Structure of the extension's popup and overlay.
    CSS: Styling the extension's UI.
    JavaScript: Implementing all the extension's logic (bookmark interaction, swiping, data storage, etc.).
    Firefox Browser APIs: browser.bookmarks, browser.storage.local, etc.

IV.  Important Considerations

    Permissions: In your manifest.json file, request the necessary permissions to access and modify the user's bookmarks.
    User Experience (UX): Focus on creating a smooth and intuitive user experience. Make the swiping interaction feel natural and provide clear feedback to the user.
    Performance: Ensure the extension is performant, especially when handling a large number of bookmarks.