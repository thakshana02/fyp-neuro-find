// import { 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword,
//     signOut,
//     onAuthStateChanged,
//     GoogleAuthProvider,
//     signInWithPopup
//   } from "firebase/auth";
//   import { auth } from "./config";
  
//   // Sign up with email and password
//   export const signUp = async (email, password) => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       return userCredential.user;
//     } catch (error) {
//       throw error;
//     }
//   };
  
//   // Sign in with email and password
//   export const signIn = async (email, password) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       return userCredential.user;
//     } catch (error) {
//       throw error;
//     }
//   };
  
//   // Sign in with Google
//   export const signInWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const userCredential = await signInWithPopup(auth, provider);
//       return userCredential.user;
//     } catch (error) {
//       throw error;
//     }
//   };
  
//   // Sign out
//   export const logOut = async () => {
//     try {
//       await signOut(auth);
//       return true;
//     } catch (error) {
//       throw error;
//     }
//   };
  
//   // Auth state observer
//   export const subscribeToAuthChanges = (callback) => {
//     return onAuthStateChanged(auth, callback);
//   };    