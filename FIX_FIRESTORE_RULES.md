# How to Fix Firestore Permission Denied Error

## Quick Fix - Update Firestore Security Rules

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ccpl-coa-generator**

### Step 2: Navigate to Firestore Rules
1. In the left sidebar, click on **Firestore Database**
2. Click on the **Rules** tab at the top

### Step 3: Update the Rules
1. You'll see the current rules (probably something like):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

2. **Replace ALL the rules** with this code:
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

### Step 4: Publish the Rules
1. Click the **Publish** button (usually at the top right)
2. Confirm the publish action

### Step 5: Test
1. Go back to your application
2. Refresh the page
3. Try saving again - it should work now!

## Visual Guide

1. **Firebase Console** → Your Project → **Firestore Database** → **Rules** tab
2. **Replace** the existing rules with the code above
3. Click **Publish**
4. Wait a few seconds for rules to update
5. Refresh your app and try again

## Important Notes

⚠️ **Security Warning**: The rules above (`allow read, write: if true`) allow **anyone** to read and write to your database. This is fine for development/testing, but for production you should implement proper authentication-based rules.

## For Production (Later)

When you're ready for production, use rules like this:
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

This requires users to be authenticated before they can read/write.

## Still Having Issues?

If you still get permission errors after updating rules:
1. Make sure you clicked **Publish** (not just saved)
2. Wait 10-30 seconds for rules to propagate
3. Clear your browser cache and refresh
4. Check that you're editing the correct Firebase project
