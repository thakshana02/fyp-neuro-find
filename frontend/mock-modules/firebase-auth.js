// Mock Firebase auth
const getAuth = () => ({
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
  });
  
  const signInWithEmailAndPassword = () => Promise.resolve({});
  const createUserWithEmailAndPassword = () => Promise.resolve({});
  const signOut = () => Promise.resolve();
  
  module.exports = {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
  };