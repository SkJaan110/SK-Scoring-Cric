const auth = firebase.auth();

// Signup
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Signup successful: " + userCredential.user.email);
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
}

// Login
function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Welcome: " + userCredential.user.email);
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
}

// Google Login
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      alert("Google Login Successful: " + result.user.displayName);
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
}
