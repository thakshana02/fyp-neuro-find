// 'use client';

// import { useState, useEffect } from 'react';
// import { auth, db } from '../firebase/config';
// import { signInAnonymously, signOut } from 'firebase/auth';
// import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

// export default function FirebaseTestPage() {
//   const [status, setStatus] = useState('Testing Firebase connection...');
//   const [user, setUser] = useState(null);
//   const [testResults, setTestResults] = useState([]);

//   useEffect(() => {
//     async function testFirebase() {
//       try {
//         // Test 1: Firebase initialization
//         setTestResults(prev => [...prev, { name: 'Firebase Initialization', result: 'Success', details: 'Firebase SDK initialized correctly' }]);
        
//         // Test 2: Anonymous Auth
//         try {
//           const userCredential = await signInAnonymously(auth);
//           setUser(userCredential.user);
//           setTestResults(prev => [...prev, { name: 'Authentication', result: 'Success', details: `Signed in anonymously with UID: ${userCredential.user.uid}` }]);
//         } catch (error) {
//           setTestResults(prev => [...prev, { name: 'Authentication', result: 'Failed', details: error.message }]);
//           throw error;
//         }

//         // Test 3: Firestore
//         try {
//           // Create a test collection if it doesn't exist and add a document
//           const docRef = await addDoc(collection(db, 'firebase_test'), {
//             test: 'Firebase Connection Test',
//             timestamp: serverTimestamp(),
//           });
          
//           // Verify 
//           const querySnapshot = await getDocs(collection(db, 'firebase_test'));
//           const docsCount = querySnapshot.size;
          
//           setTestResults(prev => [...prev, { 
//             name: 'Firestore', 
//             result: 'Success', 
//             details: `Added document with ID: ${docRef.id}. Total test documents: ${docsCount}` 
//           }]);
//         } catch (error) {
//           setTestResults(prev => [...prev, { name: 'Firestore', result: 'Failed', details: error.message }]);
//           throw error;
//         }

//         setStatus('All tests completed successfully!');
//       } catch (error) {
//         console.error('Firebase test failed:', error);
//         setStatus(`Firebase connection test failed: ${error.message}`);
//       }
//     }

//     testFirebase();

//     // Cleanup function
//     return () => {
//       if (auth.currentUser) {
//         signOut(auth);
//       }
//     };
//   }, []);

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      
//       <div className="mb-6">
//         <div className={`p-4 rounded-md ${status.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//           {status}
//         </div>
//       </div>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Test Results</h2>
//         <div className="border rounded-md">
//           {testResults.map((test, index) => (
//             <div key={index} className={`p-4 ${index !== testResults.length - 1 ? 'border-b' : ''}`}>
//               <div className="flex justify-between items-center">
//                 <span className="font-medium">{test.name}</span>
//                 <span className={`px-2 py-1 rounded-full text-xs ${test.result === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                   {test.result}
//                 </span>
//               </div>
//               <p className="text-gray-600 mt-1 text-sm">{test.details}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {user && (
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Current User</h2>
//           <div className="bg-gray-100 p-4 rounded-md">
//             <p><span className="font-medium">UID:</span> {user.uid}</p>
//             <p><span className="font-medium">Anonymous:</span> {user.isAnonymous ? 'Yes' : 'No'}</p>
//           </div>
//         </div>
//       )}

//       <div className="mt-8">
//         <p className="text-sm text-gray-500">Note: This page creates test documents in your Firestore database. You may want to delete these documents after confirming everything works.</p>
//       </div>
//     </div>
//   );
// }