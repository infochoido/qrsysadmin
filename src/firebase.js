// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Firestore를 사용할 경우
import { getAuth } from 'firebase/auth'; // 인증을 사용할 경우

const firebaseConfig = {
  apiKey: "AIzaSyAkSesUqEgzlLS5w_lDsz_dgC5mhxquqPs",
  authDomain: "qrsys-7d863.firebaseapp.com",
  projectId: "qrsys-7d863",
  storageBucket: "qrsys-7d863.appspot.com",
  messagingSenderId: "616343160837",
  appId: "1:616343160837:web:e025a13dce4af93aa0346c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore와 인증 초기화
export const db = getFirestore(app);
export const auth = getAuth(app);
