// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - FIREBASE CONFIG
// ─────────────────────────────────────────────────────────────────────

// Importar Firebase (desde CDN) - SIN ESPACIOS
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    query,
    where
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// TU CONFIG DE FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyCNSjHFIaDNsnQ6QD2pMGUedtyBZHRAVTQ",
    authDomain: "aula-preescolar.firebaseapp.com",
    projectId: "aula-preescolar",
    storageBucket: "aula-preescolar.firebasestorage.app",
    messagingSenderId: "1009499689278",
    appId: "1:1009499689278:web:582588edffd0c9716adc6f"
};

// Inicializar Firebase (renombrado para evitar conflicto con app.js)
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Exportar para uso global en window
window.firebaseApp = firebaseApp;
window.auth = auth;
window.db = db;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;
window.updateDoc = updateDoc;
window.query = query;
window.where = where;

console.log('✅ Firebase configurado');
console.log('📦 Project ID:', firebaseConfig.projectId);
