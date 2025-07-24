import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCg57ugM27wlkA-DC8xKkcuoJsVQ7SASVI",
  authDomain: "minted-app-firebase.firebaseapp.com",
  projectId: "minted-app-firebase",
  storageBucket: "minted-app-firebase.appspot.com",
  messagingSenderId: "926108755589",
  appId: "1:926108755589:ios:2e6089ca67be5776ea2bec",
  // measurementId: "G-XXXXXXXXXX" // Si vous avez un measurementId, sinon vous pouvez l'omettre
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, isSupported };

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
