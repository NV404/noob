import React, { useState, useEffect, useContext, createContext } from 'react';
import { auth,db } from './firebase';
import Router from 'next/router'
import firebase from 'firebase/app'

const authContext = createContext();

export function AuthProvider({ children }) {
  const authuser = useFirebaseAuth();
  return <authContext.Provider value={authuser}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, seterrorMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);


  const register = (email, password, username) => {
    auth.createUserWithEmailAndPassword(email, password).then((authuserr) => {
        return authuserr.user.updateProfile({
            displayName: username,
            photoURL: "https://firebasestorage.googleapis.com/v0/b/twitter-clone-6d3a7.appspot.com/o/ProfilePic%2Fdefault.png?alt=media",
        }).then(
          db.collection("users").doc(username).set({
            id: authuserr.user.uid,
            username: username,
            name: username,
            email: email,
            bio: "404 bio not found",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            profileimage: "https://firebasestorage.googleapis.com/v0/b/twitter-clone-6d3a7.appspot.com/o/ProfilePic%2Fdefault.png?alt=media",
        })
        )
    }).catch((error) => {
      var errorMessage = error.message;
        seterrorMessage(errorMessage);
        console.log(errorMessage);
    });
}

const login = (email, password) => {
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
        var errorMessage = error.message;
        seterrorMessage(errorMessage);
        console.log(errorMessage);
      });
      
}

  const logout = () => {
    auth.signOut()
    Router.push("/")
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    errorMessage,
  };
}