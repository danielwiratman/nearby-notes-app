import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB6rTDNX-ZG0P68ORxtNSLTFmoK9qs9UyI",
    authDomain: "nearby-social-e492d.firebaseapp.com",
    projectId: "nearby-social-e492d",
    storageBucket: "nearby-social-e492d.appspot.com",
    messagingSenderId: "993719464174",
    appId: "1:993719464174:web:1486c4de5a6fe3c29243ff",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
export const db = getFirestore(app);

