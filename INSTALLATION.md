# Installation Guide - Cricket Live Scores Chrome Extension

## Quick Start

### Step 1: Prepare the Extension
1. Ensure all files are in the extension directory:
   ```
   cricket-extension/
   ├── manifest.json
   ├── popup.html
   ├── styles.css
   ├── popup.js
   ├── storage.js
   ├── mockData.js
   ├── orchestrator.js
   ├── icons/
   │   └── icon.svg
   └── README.md
   ```

### Step 2: Load in Chrome
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle switch in top-right corner)
4. Click **"Load unpacked"** button
5. Select the extension directory (`agents2-s3-cricmatches-livescore`)
6. The extension should now appear in your extensions list

### Step 3: Access the Extension
1. Look for the cricket icon in your Chrome toolbar
2. Click the icon to open the popup
3. You should see the cricket matches interface

## Troubleshooting

### Extension Not Loading
- **Check file structure**: Ensure all required files are present
- **Check manifest.json**: Verify it's valid JSON
- **Check console**: Look for error messages in Chrome DevTools

### Icons Not Showing
- **Temporary fix**: The extension uses SVG icons which should work
- **For PNG icons**: Use the `create_icons.html` file to generate proper PNG icons
- **Alternative**: Comment out the icons section in manifest.json for testing

### Popup Not Opening
- **Check permissions**: Ensure storage permission is granted
- **Check console**: Open DevTools (F12) and check for JavaScript errors
- **Reload extension**: Click the refresh button on the extension card

### Data Not Loading
- **Check network**: Ensure internet connection is working
- **Check mock data**: The extension uses mock data, so it should work offline
- **Check storage**: Verify Chrome storage is working

## Testing the Extension

### Basic Functionality Test
1. **Open popup**: Click the extension icon
2. **View matches**: Check if live and upcoming matches are displayed
3. **Subscribe**: Click "Subscribe" on a match (should turn green)
4. **View live scores**: Click on a subscribed live match
5. **Check storage**: Subscriptions should persist after closing/reopening

### Advanced Testing
1. **Tab switching**: Switch between Live and Upcoming tabs
2. **Auto-refresh**: Wait 30 seconds to see live score updates
3. **Multiple subscriptions**: Subscribe to multiple matches
4. **Unsubscribe**: Click "Subscribed" to unsubscribe

## Development Mode

### Making Changes
1. Edit any file in the extension directory
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension card
4. Test changes in the popup

### Debugging
1. **Popup debugging**: Right-click the extension icon → "Inspect popup"
2. **Background debugging**: Go to extension details → "Inspect views: background page"
3. **Storage debugging**: DevTools → Application → Storage → Local Storage

## Production Deployment

### Before Publishing
1. **Replace mock data**: Update `mockData.js` with real API calls
2. **Add proper icons**: Create PNG icons in required sizes
3. **Test thoroughly**: Ensure all features work correctly
4. **Update manifest**: Set proper version and description

### Chrome Web Store
1. **Create developer account**: Sign up at Chrome Web Store Developer Dashboard
2. **Package extension**: Create a ZIP file of the extension directory
3. **Upload**: Submit the ZIP file through the developer dashboard
4. **Review process**: Wait for Google's review and approval

## Support

### Common Issues
- **"This extension may be corrupted"**: Re-download and reinstall
- **"Manifest version 2 is deprecated"**: Already using Manifest V3
- **"Permission denied"**: Check Chrome extension permissions

### Getting Help
1. Check the browser console for error messages
2. Verify all files are present and properly formatted
3. Test in a fresh Chrome profile
4. Check Chrome extension documentation

---

**Note**: This extension is currently in development mode with mock data. Replace the mock functions with real API calls for production use.
