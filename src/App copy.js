import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from './views/home'
import ColorChange from './views/cc'
import Login from './views/login'
import Navbar from './components/navbars/navbar'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCt0yJTFVzDyL9H37LnIReFiM-fNClXCc",
  authDomain: "img2cp.firebaseapp.com",
  projectId: "img2cp",
  storageBucket: "img2cp.appspot.com",
  messagingSenderId: "495941888799",
  appId: "1:495941888799:web:4527d509b7947ca34a9e2a",
  measurementId: "G-LLQQ721M2K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [signedIn, setSignedIn] = useState(false)
  return (
    <div className="relative bg-zinc-900 min-h-screen">
      {signedIn ?
        <div className="px-4 md:px-10 mx-auto w-full md:pt-10">
          <Navbar setSignedIn={setSignedIn} />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/cc" element={<ColorChange />} />
            <Route path="*" element={<Navigate replace to="/home" />} />
          </Routes>
        </div>
        :
        <Login signedIn={signedIn} setSignedIn={setSignedIn} />
      }
    </div>
  );
}

export default App;
