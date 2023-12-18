import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyB--SfmvwZCBxh6GZpePnNa9j-VSwnfMSY",
  authDomain: "invoiceforge.firebaseapp.com",
  projectId: "invoiceforge",
  storageBucket: "invoiceforge.appspot.com",
  messagingSenderId: "493550262813",
  appId: "1:493550262813:web:aec91bdf440989e052c4f4",
  measurementId: "G-XTKFEJZ5QX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
