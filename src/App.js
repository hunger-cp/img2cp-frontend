import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getAuth, signInWithPopup, signInWithEmailAndPassword, fetchSignInMethodsForEmail, GoogleAuthProvider} from "firebase/auth";

import Home from './views/home'
import ColorChange from './views/cc'
import Login from './views/login'
import Signup from './views/signup'
import Navbar from './components/navbars/navbar'
import GuestNavbar from './components/navbars/guestnavbar'
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

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: null, 
      email: ""
    }
  }

  componentDidMount() {
    const auth = getAuth();
    this.unregisterAuthObserver = auth.onIdTokenChanged((user) => {
      if (!!user) {
        auth
          .currentUser.getIdTokenResult()
          .then((idTokenResult) => {
            console.log(idTokenResult);
            this.setState({
              isSignedIn: user.emailVerified,
              email: user.email
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.setState({ isSignedIn: !!user });
      }
    });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    const navbar = () => this.state.isSignedIn ? <Navbar signOut={() => {getAuth().signOut(); window.location.reload()}} /> : <GuestNavbar />;
    return (
      <div className="relative min-h-screen">
          <div className="px-4 md:px-2 mx-auto w-full">
            <Routes>
              <Route path="/home" element={<>{navbar()}<Home/></>} />
              <Route path="/login" element={this.state.isSignedIn ? <Navigate replace to="/home" /> : <Login />} />
              <Route path="/signup" element={this.state.isSignedIn ? <Navigate replace to="/home" /> : <Signup />} />
              <Route path="/cc" element={<>{navbar()}<ColorChange /></>} />
              <Route path="*" element={<Navigate replace to="/home" />} />
            </Routes>
          </div>
      </div>
    );
  }
}

