// app.js

// Firebase Auth instance
const auth = firebase.auth();

// ----------- Email/Password Signup -----------
function signUp() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Signup successful! Welcome " + userCredential.user.email);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Signup error: " + error.message);
      console.error(error);
    });
}

// ----------- Email/Password Login -----------
function signIn() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login successful! Welcome " + userCredential.user.email);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Login error: " + error.message);
      console.error(error);
    });
}

// ----------- Google Login -----------
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      alert("Google login successful! Welcome " + user.displayName);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Google login failed: " + error.message);
      console.error(error);
    });
}

// ----------- Logout -----------
function logOut() {
  auth.signOut()
    .then(() => {
      alert("Logged out!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
}

// ----------- Auth State Control -----------
auth.onAuthStateChanged((user) => {
  const currentPage = window.location.pathname;

  if (!user) {
    // Agar login nahi hai to sirf index.html par rehne do
    if (!currentPage.includes("index.html")) {
      window.location.href = "index.html";
    }
  } else {
    // Agar login hai aur abhi login page par ho to dashboard bhejo
    if (currentPage.includes("index.html")) {
      window.location.href = "dashboard.html";
    }

    // Agar profile page hai → user details dikhado
    if (currentPage.includes("profile.html")) {
      document.getElementById("userName").innerText = user.displayName || "No Name";
      document.getElementById("userEmail").innerText = user.email;
    }
  }
});
