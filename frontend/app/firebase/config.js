// import { initializeApp } from "firebase/app";
// import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Set auth persistence to local (keeps user logged in even after page refresh)
// if (typeof window !== 'undefined') {
//   setPersistence(auth, browserLocalPersistence);
// }

// export { app, auth, db };