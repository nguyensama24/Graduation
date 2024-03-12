import firebase from "firebase/compat/app";
// Import the functions you need from the SDKs you need
import "firebase/compat/database";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyCdTWx1LWQ2Ihu_IM_t2yYc0HqanZpMEd4",
  // authDomain: "uploadimgtofirebase-8d5c9.firebaseapp.com",
  // projectId: "uploadimgtofirebase-8d5c9",
  // storageBucket: "uploadimgtofirebase-8d5c9.appspot.com",
  // messagingSenderId: "939682945824",
  // appId: "1:939682945824:web:319cfb0102d58890b95545"

  // apiKey: "AIzaSyDUTTDrCAT24dmHuHK0OvOpI7-lhEMJiJ4",
  // authDomain: "buyzzle-f8313.firebaseapp.com",
  // databaseURL: "https://buyzzle-f8313-default-rtdb.firebaseio.com",
  // projectId: "buyzzle-f8313",
  // storageBucket: "buyzzle-f8313.appspot.com",
  // messagingSenderId: "1041627352430",
  // appId: "1:1041627352430:web:dcfa9e53c29d3a88cb857f",
  // measurementId: "G-FJ8LP13MNT"
  apiKey: "AIzaSyD2RavRVHO56Iw-0jefnNMGro1Gg9y8xyE",
  authDomain: "uploadimg-d0873.firebaseapp.com",
  projectId: "uploadimg-d0873",
  storageBucket: "uploadimg-d0873.appspot.com",
  messagingSenderId: "1078795630642",
  appId: "1:1078795630642:web:b9e3e56074909140bc242b",
  measurementId: "G-JLZWZPKM29",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();
export default firebase;
