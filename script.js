/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/* ================= GLOBAL VARIABLES ================= */
let generatedOTP = "";
let tempUser = null;

/* ================= PASSWORD VALIDATION ================= */
const password = document.getElementById("password");

if (password) {
  password.addEventListener("input", () => {
    const val = password.value;

    document.getElementById("length").style.color =
      val.length <= 8 && val.length > 0 ? "lime" : "red";

    document.getElementById("upper").style.color =
      /[A-Z]/.test(val) ? "lime" : "red";

    document.getElementById("lower").style.color =
      /[a-z]/.test(val) ? "lime" : "red";

    document.getElementById("number").style.color =
      /[0-9]/.test(val) ? "lime" : "red";

    document.getElementById("special").style.color =
      /[!@#$%^&*]/.test(val) ? "lime" : "red";
  });
}

/* ================= PASSWORD TOGGLE ================= */
function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

function toggleLoginPassword() {
  const pass = document.getElementById("loginPassword");
  pass.type = pass.type === "password" ? "text" : "password";
}

/* ================= REGISTER ================= */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (pass !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    /* STORE TEMP USER */
    tempUser = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("code").value + document.getElementById("phone").value,
      country: document.getElementById("country").value,
      dob: document.getElementById("dob").value,
      password: pass
    };

    /* GENERATE OTP */
    generatedOTP = Math.floor(100000 + Math.random() * 900000);

    alert("Your OTP is: " + generatedOTP); // demo purpose

    /* SHOW OTP SECTION */
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("otpSection").style.display = "block";
  });
}

/* ================= VERIFY OTP ================= */
function verifyOTP() {
  const enteredOTP = document.getElementById("otp").value;

  if (enteredOTP == generatedOTP) {
    localStorage.setItem("user", JSON.stringify(tempUser));

    alert("Registration Successful 🎉");
    window.location.href = "login.html";
  } else {
    alert("Invalid OTP ❌");
  }
}

/* ================= LOGIN ================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPassword").value;

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.password === pass) {
      sessionStorage.setItem("isLoggedIn", "true");
      alert("Login Successful 🎉");
      window.location.href = "account.html";
    } else {
      alert("Invalid Email or Password ❌");
    }
  });
}

/* ================= LOGOUT ================= */
function logout() {
  sessionStorage.removeItem("isLoggedIn");
  alert("Logged out!");
  window.location.href = "login.html";
}

/* ================= LOAD USER DATA ================= */
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  const nameEl = document.getElementById("userName");
  const emailEl = document.getElementById("userEmail");

  if (nameEl) nameEl.innerText = user.name;
  if (emailEl) emailEl.innerText = user.email;
}

/* ================= RESET PASSWORD ================= */
function resetPassword() {
  const email = document.getElementById("resetEmail").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email === email) {
    const newPass = prompt("Enter new password:");

    user.password = newPass;
    localStorage.setItem("user", JSON.stringify(user));

    alert("Password updated!");
    window.location.href = "login.html";
  } else {
    alert("Email not found!");
  }
}

/* ================= GOOGLE LOGIN ================= */
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(() => {
      alert("Login Success ✅");
      window.location.href = "account.html";
    })
    .catch(err => alert(err.message));
}