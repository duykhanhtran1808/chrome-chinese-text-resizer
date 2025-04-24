# Chinese Text Resizer Chrome Extension

A simple Chrome extension that allows you to increase the size of Chinese text on any webpage.

## Features

- Resize only Chinese characters on web pages
- Customize text size in pixels
- Quickly adjust size with +/- buttons (5px increments)
- Real-time preview of the selected size
- Changes persist across browser sessions

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the directory containing this extension
5. The extension is now installed and ready to use

## Usage

1. Navigate to any webpage containing Chinese text
2. Click the extension icon in your browser toolbar
3. Use the provided input field to set the desired text size in pixels
4. Use the + and - buttons to quickly increase or decrease the text size by 5px
5. Click "Apply" to apply the changes to the current webpage
6. The size settings will be remembered for future use

## Notes

- This extension only affects Chinese characters (Unicode range U+4E00 to U+9FFF)
- The extension uses MutationObserver to handle dynamically loaded content
- Your size preference is saved using Chrome's sync storage 