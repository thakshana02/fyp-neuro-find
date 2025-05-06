// Mock Firebase firestore
const getFirestore = () => ({});
const collection = () => ({});
const doc = () => ({});
const getDocs = () => Promise.resolve({ docs: [] });
const getDoc = () => Promise.resolve({ exists: () => false, data: () => null });

module.exports = {
  getFirestore,
  collection,
  doc, 
  getDocs,
  getDoc,
};