import type { Auth } from "firebase-admin/auth";

let _auth: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    const admin = require("firebase-admin");
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    }
    _auth = admin.auth();
  }
  return _auth!;
}
