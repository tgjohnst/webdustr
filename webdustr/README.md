# webdustr

## Overview
webdustr is a Firefox extension designed to help users efficiently review and manage their bookmarks through a Tinder-like "swipe" interface. Users can easily keep or discard bookmarks, making bookmark management a more engaging experience.

## Features
- **Bookmark Access**: Read and modify bookmarks with necessary permissions.
- **User Interface**: 
  - A browser action button to open the main menu.
  - Options to start swiping, show the discard queue, reset kept sites, and configure folders.
  - A swipe overlay for intuitive interaction.
- **Swiping Logic**: 
  - Swipe right to keep bookmarks.
  - Swipe left to discard bookmarks.
  - A bookmark counter to track remaining unseen bookmarks.
- **Data Storage**: 
  - Store user preferences and maintain a discard queue.

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd webdustr
   ```
3. Load the extension in Firefox:
   - Open Firefox and go to `about:debugging`.
   - Click on "This Firefox".
   - Click "Load Temporary Add-on" and select the `manifest.json` file from the `src` directory.

## Usage
- Click the browser action button to open the extension menu.
- Select "Start Swiping" to begin reviewing bookmarks.
- Use the swipe gestures to keep or discard bookmarks.
- Access the discard queue to manage discarded bookmarks.
- Reset kept sites to reintroduce all bookmarks for swiping.

## Development
To contribute to the project, please follow the development plan outlined in the `Requirements.md` file. Ensure to test thoroughly and refine the user experience based on feedback.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.