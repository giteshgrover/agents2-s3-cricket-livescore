# Quick Setup Guide

## 🔧 Configuration Setup

### Step 1: Create Configuration File
```bash
cp config.template.js config.js
```

### Step 2: Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 3: Configure API Key
Edit `config.js` and replace the placeholder:
```javascript
GEMINI_API_KEY: 'your-actual-api-key-here',
```

### Step 4: Reload Extension
1. Go to `chrome://extensions/`
2. Find your extension
3. Click the refresh button
4. Test the extension

## 🔒 Security Notes

- ✅ `config.js` is in `.gitignore` - your API key won't be committed
- ✅ Use the template file for sharing your code
- ✅ Never share your actual API key publicly

## 🚀 Optional: Cricket API Integration

If you have a cricket API, you can also configure it in `config.js`:

```javascript
CRICKET_API: {
    BASE_URL: 'https://your-cricket-api.com/v1',
    API_KEY: 'your-cricket-api-key'
}
```

## ✅ Verification

The extension will automatically detect if your configuration is valid. Check the browser console for any configuration warnings.

## 🆘 Troubleshooting

### Config Not Loading
- Ensure `config.js` exists (not just `config.template.js`)
- Check for JavaScript syntax errors in `config.js`
- Verify the file is in the extension root directory

### API Key Not Working
- Verify the API key is correct
- Check if the API key has proper permissions
- Ensure you're using the latest API key format

### Extension Not Updating
- Reload the extension in Chrome
- Clear browser cache
- Check for console errors

---

**Need Help?** Check the main README.md for detailed documentation.
