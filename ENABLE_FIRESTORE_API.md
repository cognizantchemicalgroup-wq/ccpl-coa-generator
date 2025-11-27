# How to Enable Cloud Firestore API

## Quick Fix

The error message indicates that the Cloud Firestore API is not enabled in your Firebase project. Follow these steps to enable it:

## Step 1: Enable Firestore API

1. **Click this link** (or copy and paste it in your browser):
   ```
   https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=ccpl-coa-generator
   ```

2. **Click the "Enable" button** on the page

3. **Wait 2-5 minutes** for the API to be activated

## Step 2: Verify Firestore is Enabled in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ccpl-coa-generator**
3. In the left sidebar, click on **Firestore Database**
4. If you see "Create database" button, click it and follow the setup:
   - Choose **Start in test mode** (for development)
   - Select a location (choose the closest to you)
   - Click **Enable**

## Step 3: Set Up Firestore Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the rules with this (for development/testing):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /coa_documents/{document} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

## Step 4: Test the Application

1. Refresh your browser page
2. Fill out a COA form
3. Click "Save to Database"
4. It should work now!

## Alternative: Enable via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ccpl-coa-generator**
3. Click on **Firestore Database** in the left sidebar
4. If it's not enabled, you'll see a "Create database" button
5. Click it and follow the setup wizard

## Troubleshooting

### Still getting permission errors?

1. **Check Firestore is enabled**: Make sure you see the Firestore Database in Firebase Console
2. **Check Security Rules**: Make sure rules allow read/write (use test mode rules above for development)
3. **Wait a few minutes**: After enabling, wait 2-5 minutes for changes to propagate
4. **Clear browser cache**: Sometimes cached errors persist
5. **Check internet connection**: Make sure you have a stable internet connection

### Error: "API has not been used"

- This means the API needs to be enabled in Google Cloud Console
- Use the link provided in Step 1 above
- Wait a few minutes after enabling

### Error: "Permission denied"

- Check your Firestore security rules
- Make sure they allow read/write operations
- For testing, use the rules provided in Step 3

## Security Note

⚠️ **Important**: The test mode rules (`allow read, write: if true`) allow anyone to read and write to your database. This is only for development/testing. For production, implement proper authentication-based rules.

## Need Help?

If you continue to have issues:
1. Check the browser console (F12) for detailed error messages
2. Verify your Firebase project ID matches: `ccpl-coa-generator`
3. Make sure you're logged into the correct Google account in Firebase Console
