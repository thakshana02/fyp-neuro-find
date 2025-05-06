import { 
    collection, 
    doc, 
    addDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where,
    serverTimestamp 
  } from "firebase/firestore";
  import { db } from "./config";
  
  // Add a document to a collection
  export const addDocument = async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };
  
  // Get a document by ID
  export const getDocument = async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Get all documents from a collection
  export const getCollection = async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      throw error;
    }
  };
  
  // Update a document
  export const updateDocument = async (collectionName, id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Delete a document
  export const deleteDocument = async (collectionName, id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Query documents
  export const queryDocuments = async (collectionName, field, operator, value) => {
    try {
      const q = query(collection(db, collectionName), where(field, operator, value));
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      throw error;
    }
  };