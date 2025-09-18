// firebaseAdmin.js
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json"); 
// download from Firebase Console → Project Settings → Service Accounts

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
