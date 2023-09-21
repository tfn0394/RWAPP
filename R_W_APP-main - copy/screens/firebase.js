// const firebase = require("firebase");
// require("firebase/firestore");
import firebase from "firebase/app";
import "firebase/database";
// Initializing firebase firestore
/**
 *  Firebase is where we display from App to a Website.
 *  It is also where we specify the time and date for the data display.
 */
firebase.initializeApp({
  apiKey: "AIzaSyCEnA7P9hpb0erO2v_EGtCaJIN38erS5b8",
  authDomain: "kumeu-river-winery-2021.firebaseapp.com",
  databaseURL:
    "https://kumeu-river-winery-2021-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kumeu-river-winery-2021",
  storageBucket: "kumeu-river-winery-2021.appspot.com",
  messagingSenderId: "20341143971",
  appId: "1:20341143971:web:162bbad313b6445e55c216",
  measurementId: "G-BG4ZD1NWTD",
});

export default firebase;

// import firebase from "firebase/app";
// // import * as firebase from "firebase/app";
// // import { firebase } from "@firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyCEnA7P9hpb0erO2v_EGtCaJIN38erS5b8",
//   authDomain: "kumeu-river-winery-2021.firebaseapp.com",
//   databaseURL:
//     "https://kumeu-river-winery-2021-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "kumeu-river-winery-2021",
//   storageBucket: "kumeu-river-winery-2021.appspot.com",
//   messagingSenderId: "20341143971",
//   appId: "1:20341143971:web:162bbad313b6445e55c216",
//   measurementId: "G-BG4ZD1NWTD",
// };

// firebase.initializeApp(firebaseConfig);
// // const firebaseApp = firebase.initializeApp(firebaseConfig);
// // const db = firebaseApp.Database();
