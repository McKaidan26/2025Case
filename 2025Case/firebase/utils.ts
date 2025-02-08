import { db, auth } from './config';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc 
} from 'firebase/firestore';
import { UserProfile, HealthLog } from '../types';

// User Profile Functions
export const createUserProfile = async (uid: string, email: string, firstName: string, lastName: string) => {
  const userProfile: UserProfile = {
    uid,
    email,
    firstName,
    lastName,
    medications: {
      baseDrug: '',
      integraseInhibitor: '',
      nnrti: '',
      proteaseInhibitor: ''
    }
  };
  
  await setDoc(doc(db, 'users', uid), userProfile);
  return userProfile;
};

export const updateMedications = async (
  uid: string, 
  medications: UserProfile['medications']
) => {
  await setDoc(doc(db, 'users', uid), { medications }, { merge: true });
};

export const getUserProfile = async (uid: string) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as UserProfile;
};

// Health Logs Functions
export const addHealthLog = async (log: HealthLog) => {
  await addDoc(collection(db, 'healthLogs'), log);
};

export const getHealthLogs = async (uid: string) => {
  const q = query(collection(db, 'healthLogs'), where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as HealthLog);
};

export const getHealthLogsByDate = async (uid: string) => {
  const q = query(
    collection(db, 'healthLogs'), 
    where('uid', '==', uid)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as HealthLog);
}; 