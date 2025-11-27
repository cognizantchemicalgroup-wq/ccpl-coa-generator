# Firebase Setup Guide

This guide will help you set up Firebase for the COA Generator application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 2: Enable Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development) or **Start in production mode** (for production)
4. Select a location for your database
5. Click **Enable**

## Step 3: Get Your Firebase Configuration

1. In your Firebase project, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click the **Web** icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "COA Generator")
6. Copy the Firebase configuration object

## Step 4: Configure the Application

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Step 5: Set Up Firestore Security Rules (Important!)

1. Go to **Firestore Database** → **Rules** in Firebase Console
2. For development, you can use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /coa_documents/{document} {
      allow read, write: if true; // For development only
    }
  }
}
```

3. **For production**, use proper authentication rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /coa_documents/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Click **Publish** to save the rules

## Step 6: Test the Setup

1. Open `index.html` in your browser
2. Create a test COA document
3. Click "Save to Database"
4. Check Firebase Console → Firestore Database to see if the document was created
5. Open `dashboard.html` to view all saved documents

## Troubleshooting

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add your domain or use `localhost` for local testing

### Error: "Permission denied"
- Check your Firestore security rules
- Make sure rules allow read/write operations

### Documents not appearing
- Check browser console for errors
- Verify Firebase configuration is correct
- Ensure Firestore is enabled in your Firebase project

## Data Structure

Documents are stored in the `coa_documents` collection with the following structure:

```javascript
{
  productCode: "F2504001",
  productName: "Acetone EP/BP",
  chemicalName: "Acetone",
  category: "Finish Goods", // or "Raw Material"
  batchNo: "F2510001",
  mfgDate: "2024-01-15",
  expiryDate: "2027-01-15",
  testType: "finish-goods", // or "raw-material"
  productData: { /* Full product object */ },
  testResults: [ /* Array of test results */ ],
  createdBy: "User Name",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Features

- ✅ **Create**: Save new COA documents to Firebase
- ✅ **Read**: View all saved documents in dashboard
- ✅ **Update**: Edit existing documents (replaces the record)
- ✅ **Delete**: Remove documents from database
- ✅ **Preview**: View PDF without downloading
- ✅ **Download**: Generate and download PDF anytime

## Notes

- All timestamps are stored as Firestore Timestamps
- When editing, the `createdAt` field is preserved
- The `updatedAt` field is automatically updated on each save
- PDF generation works with both new and saved documents
