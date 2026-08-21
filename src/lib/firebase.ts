import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if available
export const db = firebaseConfigData.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// --- Helper CRUD functions with error handling & local fallback ---

// USERS
export async function saveUserToCloud(user: any) {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, user, { merge: true });
  } catch (err) {
    console.warn('Firebase save user error, using local state:', err);
  }
}

export async function fetchUsersFromCloud() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return users;
  } catch (err) {
    console.warn('Firebase fetch users error:', err);
    return null;
  }
}

// FOLDERS
export async function saveFolderToCloud(folder: any) {
  try {
    const ref = doc(db, 'folders', folder.id);
    await setDoc(ref, folder, { merge: true });
  } catch (err) {
    console.warn('Firebase save folder error:', err);
  }
}

export async function deleteFolderFromCloud(folderId: string) {
  try {
    await deleteDoc(doc(db, 'folders', folderId));
  } catch (err) {
    console.warn('Firebase delete folder error:', err);
  }
}

export async function fetchFoldersForUser(userId: string) {
  try {
    const q = query(collection(db, 'folders'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const folders: any[] = [];
    querySnapshot.forEach((doc) => {
      folders.push(doc.data());
    });
    return folders;
  } catch (err) {
    console.warn('Firebase fetch folders error:', err);
    return null;
  }
}

// NOTES
export async function saveNoteToCloud(note: any) {
  try {
    const ref = doc(db, 'notes', note.id);
    await setDoc(ref, note, { merge: true });
  } catch (err) {
    console.warn('Firebase save note error:', err);
  }
}

export async function deleteNoteFromCloud(noteId: string) {
  try {
    await deleteDoc(doc(db, 'notes', noteId));
  } catch (err) {
    console.warn('Firebase delete note error:', err);
  }
}

export async function fetchNotesForUser(userId: string) {
  try {
    const q = query(collection(db, 'notes'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const notes: any[] = [];
    querySnapshot.forEach((doc) => {
      notes.push(doc.data());
    });
    return notes;
  } catch (err) {
    console.warn('Firebase fetch notes error:', err);
    return null;
  }
}

// SAVED FORMS (PRONTUÁRIOS)
export async function saveFormToCloud(form: any) {
  try {
    const ref = doc(db, 'saved_forms', form.id);
    await setDoc(ref, form, { merge: true });
  } catch (err) {
    console.warn('Firebase save form error:', err);
  }
}

export async function deleteFormFromCloud(formId: string) {
  try {
    await deleteDoc(doc(db, 'saved_forms', formId));
  } catch (err) {
    console.warn('Firebase delete form error:', err);
  }
}

export async function fetchSavedFormsForUser(userId: string) {
  try {
    const q = query(collection(db, 'saved_forms'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const forms: any[] = [];
    querySnapshot.forEach((doc) => {
      forms.push(doc.data());
    });
    return forms;
  } catch (err) {
    console.warn('Firebase fetch forms error:', err);
    return null;
  }
}

// CUSTOM ANAMNESIS TEMPLATES
export async function saveTemplateToCloud(template: any) {
  try {
    const ref = doc(db, 'custom_templates', template.id);
    await setDoc(ref, template, { merge: true });
  } catch (err) {
    console.warn('Firebase save template error:', err);
  }
}

export async function deleteTemplateFromCloud(templateId: string) {
  try {
    await deleteDoc(doc(db, 'custom_templates', templateId));
  } catch (err) {
    console.warn('Firebase delete template error:', err);
  }
}

export async function fetchTemplatesForUser(userId: string) {
  try {
    const q = query(collection(db, 'custom_templates'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const templates: any[] = [];
    querySnapshot.forEach((doc) => {
      templates.push(doc.data());
    });
    return templates;
  } catch (err) {
    console.warn('Firebase fetch templates error:', err);
    return null;
  }
}
