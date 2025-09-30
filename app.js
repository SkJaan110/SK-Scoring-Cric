// app.js
const auth = firebase.auth();

// -------- Signup --------
function signUp() {
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!email || !password) {
    alert("Enter email and password!");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Signup successful: " + userCredential.user.email);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Signup error: " + error.message);
    });
}

// -------- Login --------
function signIn() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("Enter email and password!");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login successful: " + userCredential.user.email);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Login error: " + error.message);
    });
}

// -------- Google Login --------
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      alert("Google login successful: " + user.displayName);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Google login error: " + error.message);
    });
}

// -------- Auto redirect if logged in --------
auth.onAuthStateChanged((user) => {
  if (user && window.location.pathname.includes("index.html")) {
    window.location.href = "dashboard.html";
  }
});
