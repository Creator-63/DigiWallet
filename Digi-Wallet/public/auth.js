import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth,signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import {onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyAy9EbbjevGYa7c3MSVktvkVANwPZjQhSo",
  authDomain: "digi-wallet-c2046.firebaseapp.com",
  projectId: "digi-wallet-c2046",
  storageBucket: "digi-wallet-c2046.firebasestorage.app",
  messagingSenderId: "700758262128",
  appId: "1:700758262128:web:05d6f5df87dd5c3d670fb5",
  measurementId: "G-NDPBTSB2H3",
  dburl:"https://digi-wallet-c2046-default-rtdb.firebaseio.com",
};
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Handle Login
if (document.getElementById("login")) {
  document.getElementById("login").addEventListener("click", () => {
    const loginemail = document.getElementById("SigninEmail").value;
    const loginpassword = document.getElementById("SigninPassword").value;

    signInWithEmailAndPassword(auth, loginemail, loginpassword)
      .then((userCredential) => {
        //signed In
        const user = userCredential.user;
        alert("Login successful!");
        window.location.href = "./Dashboard.html"; // Redirect to Dashboard
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error: " + error.message);
      });
  });
}
// Handle Sign-Up
if (document.getElementById("create-newuser")) {
  document.getElementById("create-newuser").addEventListener("click", () => {
    const signupemail = document.getElementById("SignupEmail").value;
    const signuppassword = document.getElementById("SignupPassword").value;
    createUserWithEmailAndPassword(auth, signupemail, signuppassword)
      .then((userCredential) => {
        //signed up
        const user = userCredential.user;
        alert("Sign-Up successful!");
        document.getElementById('result').style.display='block'
        window.location.href = "./Password.html"; // Redirect to Login
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Error: " + error.message);
      });
  });
}


// Logout Functionality
if (document.getElementById("logout")) {
  document.getElementById("logout").addEventListener("click", () => {
      signOut(auth)
      .then(() => {
        alert("Log-out Successful");
        window.location.href = "./index.html"; // Redirect to Login
      })
    
  });
}

/*onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname !== "/HTML/index.html") {
    // User is signed in and not on the index page, redirect to index.html
    window.location.href = "./index.html";
  } else if (!user) {
    // User is not signed in, redirect to index.html (already happening in previous code)
    console.log("User not signed in. Redirecting...");
  }
});*/
