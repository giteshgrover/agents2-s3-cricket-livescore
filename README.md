# Cricket Live Scores & Subscriptions Chrome Extension

A Chrome extension that allows users to subscribe to cricket matches and view live scores in a beautiful popup interface.

## Features

- 🏏 **Match Subscriptions**: Subscribe to live and upcoming cricket matches
- ⚡ **Live Scores**: Real-time score updates for subscribed matches
- 📱 **Beautiful UI**: Modern, responsive popup interface
- 💾 **Local Storage**: Subscriptions saved in Chrome's local storage
- 🤖 **AI Orchestrator**: Gemini AI integration for enhanced functionality
- 🔄 **Auto-refresh**: Automatic live score updates every 30 seconds

## Installation

1. **Download the Extension**
   - Download or clone this repository
   - Extract the files to a local directory

2. **Configure API Keys (Optional)**
   - Copy `config.template.js` to `config.js`
   - Add your Gemini API key to `config.js`
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension directory

4. **Add Extension Icon**
   - The extension will appear in your Chrome toolbar
   - Click the extension icon to open the popup

## Usage

### Subscribing to Matches
1. Open the extension popup
2. Browse live or upcoming matches in the left panel
3. Click "Subscribe" (yellow button) to subscribe to a match
4. Subscribed matches will show "Subscribed" (green button)
5. Subscribed live matches will appear at the top of the list

### Viewing Live Scores
1. Subscribe to a live match
2. Click on the subscribed live match in the left panel
3. Live scores will appear in the right panel
4. Scores auto-refresh every 30 seconds

### Managing Subscriptions
- Subscribed matches are highlighted with a green border
- Live matches are highlighted with a red border
- Click "Subscribed" button to unsubscribe from a match

## File Structure

```
cricket-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── styles.css            # Styling for the popup
├── popup.js              # Main popup functionality
├── storage.js            # Chrome storage management
├── mockData.js           # Mock data for matches and scores
├── orchestrator.js       # Gemini AI orchestrator
├── config.template.js    # Configuration template
├── config.js             # Your configuration (create from template)
├── setup.js              # Setup and validation utilities
├── icons/                # Extension icons
├── .gitignore           # Git ignore file
└── README.md            # This file
```

## Technical Details

### Chrome Storage
- Subscriptions are stored in Chrome's local storage
- Data persists across browser sessions
- Each subscription includes match details and timestamp

### Mock Data
- Currently uses mock data for matches and live scores
- Easy to replace with real API calls
- Includes realistic cricket match scenarios

### Gemini AI Integration
- Orchestrator class for managing data flow
- Placeholder for future AI-enhanced features
- Ready for API key configuration

## Customization

### Adding Real API Data
1. Replace mock functions in `mockData.js` with real API calls
2. Update the orchestrator in `orchestrator.js`
3. Configure API endpoints and authentication

### Styling
- Modify `styles.css` for custom appearance
- Responsive design included
- Easy to customize colors and layout

### Configuration Setup
1. **Copy Template**: `cp config.template.js config.js`
2. **Get Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Add API Key**: Replace `YOUR_GEMINI_API_KEY_HERE` in `config.js`
4. **Reload Extension**: Refresh the extension in Chrome

### Gemini AI Setup
1. Get a Gemini API key from Google AI Studio
2. Add the API key to `config.js`
3. The orchestrator will automatically use the configured API key
4. Implement custom AI features as needed

## Development

### Local Development
1. Make changes to the extension files
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension card
4. Test changes in the popup

### Debugging
- Use Chrome DevTools to debug the popup
- Check the console for error messages
- Storage data can be viewed in Chrome DevTools > Application > Storage

## Future Enhancements

- [ ] Real cricket API integration
- [ ] Push notifications for match updates
- [ ] Match predictions using AI
- [ ] Player statistics and insights
- [ ] Multiple cricket formats support
- [ ] Dark mode theme
- [ ] Match highlights and commentary

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the console for error messages
2. Verify Chrome extension permissions
3. Ensure all files are properly loaded
4. Check network connectivity for API calls

---

**Note**: This extension currently uses mock data. Replace the mock functions with real API calls to get actual cricket match data and live scores.
