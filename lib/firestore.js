import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export const createDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), data);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { data: null, error: 'Document not found' };
    }
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateDocument = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCollection = async (collectionName, conditions = []) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply query conditions
    if (conditions.length > 0) {
      conditions.forEach(condition => {
        if (condition.type === 'where') {
          q = query(q, where(condition.field, condition.operator, condition.value));
        } else if (condition.type === 'orderBy') {
          q = query(q, orderBy(condition.field, condition.direction));
        } else if (condition.type === 'limit') {
          q = query(q, limit(condition.value));
        }
      });
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return { data: documents, error: null };
  } catch (error) {
    return { data: [], error: error.message };
  }
};