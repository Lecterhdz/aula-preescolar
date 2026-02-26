// ─────────────────────────────────────────────────────────────────────
// AULA PREESCOLAR - FIREBASE CONFIG
// ─────────────────────────────────────────────────────────────────────

// Importar Firebase (desde CDN)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// TU CONFIG DE FIREBASE (REEMPLAZA CON LA TUYA)
const firebaseConfig = {
    apiKey: "AIzaSyCNSjHFIaDNsnQ6QD2pMGUedtyBZHRAVTQ",
    authDomain: "aula-preescolar.firebaseapp.com",
    projectId: "aula-preescolar",
    storageBucket: "aula-preescolar.firebasestorage.app",
    messagingSenderId: "1009499689278",
    appId: "1:1009499689278:web:582588edffd0c9716adc6f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Exportar para uso global
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