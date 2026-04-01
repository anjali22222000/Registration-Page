const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
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

/* ================= SHOW/HIDE PASSWORD ================= */
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

    const user = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("code").value + document.getElementById("phone").value,
      country: document.getElementById("country").value,
      dob: document.getElementById("dob").value,
      password: pass
    };

    localStorage.setItem("user", JSON.stringify(user));


const userOtp = prompt("Enter OTP:");

if (userOtp == otp) {
  localStorage.setItem("user", JSON.stringify(user));
  alert("Registered Successfully ✅");
  window.location.href = "login.html";
} else {
  alert("Wrong OTP ❌");
}
  });
}

/* ================= LOGIN ================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    if (!validateEmail(email)) {
   alert("Invalid Email");
   return;
}
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
function logout() {
  sessionStorage.removeItem("isLoggedIn");
  alert("Logged out!");
  window.location.href = "login.html";
}
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  document.getElementById("userName").innerText = user.name;
  document.getElementById("userEmail").innerText = user.email;
}
function resetPassword() {
  const email = document.getElementById("resetEmail").value;

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Email sent 📩"))
    .catch(err => alert(err.message));
}

  if (user && user.email === email) {
    const newPass = prompt("Enter new password:");
    user.password = newPass;
    localStorage.setItem("user", JSON.stringify(user));
    alert("Password updated!");
    window.location.href = "login.html";
  } else {
    alert("Email not found!");
  }

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(() => {
      alert("Login Success ✅");
      window.location.href = "account.html";
    })
    .catch(err => alert(err.message));
}
