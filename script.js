const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
};
//firebase.initializeApp(firebaseConfig);
//const auth = firebase.auth();
let generatedOTP = null;
let tempUser = null;
let confirmationResult;
let emailOTP = null;
let resendTimer;
let countdown = 30;
/* ================= PASSWORD VALIDATION ================= */
const password = document.getElementById("password");

if (password) {
  password.addEventListener("input", () => {
    const val = password.value;

    const lengthEl = document.getElementById("length");
    const upperEl = document.getElementById("upper");
    const lowerEl = document.getElementById("lower");
    const numberEl = document.getElementById("number");
    const specialEl = document.getElementById("special");

    if (lengthEl)
      lengthEl.style.color = val.length <= 8 && val.length > 0 ? "lime" : "red";

    if (upperEl) upperEl.style.color = /[A-Z]/.test(val) ? "lime" : "red";

    if (lowerEl) lowerEl.style.color = /[a-z]/.test(val) ? "lime" : "red";

    if (numberEl) numberEl.style.color = /[0-9]/.test(val) ? "lime" : "red";

    if (specialEl)
      specialEl.style.color = /[!@#$%^&*]/.test(val) ? "lime" : "red";
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
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (pass !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    // ✅ Save data temporarily (NOT final yet)
    tempUser = {
      name: document.getElementById("name").value,
      username: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone:
        document.getElementById("code").value +
        document.getElementById("phone").value,
      country: document.getElementById("country").value,
      dob: document.getElementById("dob").value,
      password: pass,
    };

    // ✅ Generate OTP
    generatedOTP = generateOTP();

    // 👉 Simulate sending OTP to Email + Phone
    alert("OTP sent to your Email & Phone: " + generatedOTP);

    // ✅ Show OTP section
    document.getElementById("otpSection").style.display = "block";
  });
}

/* ================= LOGIN ================= */

function toggleLoginType() {
  const type = document.getElementById("loginType").value;

  const phoneField = document.getElementById("phone");
  const emailField = document.getElementById("loginEmail");
  const userField = document.getElementById("loginUsername");
  const passField = document.getElementById("loginPassword");

  if (type === "phone") {
    phoneField.style.display = "block";
    emailField.style.display = "none";
    userField.style.display = "none";
    passField.style.display = "none";
  } else if (type === "email") {
    phoneField.style.display = "none";
    emailField.style.display = "block";
    userField.style.display = "none";
    passField.style.display = "none";
  } else {
    phoneField.style.display = "none";
    emailField.style.display = "none";
    userField.style.display = "block";
    passField.style.display = "block";
  }

  document.getElementById("loginOtpSection").style.display = "none";
  document.getElementById("loginBtn").style.display = "block";
  document.getElementById("loginOtp").value = "";
  document.getElementById("otpMsg").innerText = "";
  clearInterval(resendTimer);
}

function logout() {
  sessionStorage.removeItem("isLoggedIn");
  alert("Logged out!");
  window.location.href = "login.html";
}
const user = JSON.parse(localStorage.getItem("user"));

if (user && document.getElementById("userName")) {
  document.getElementById("userName").innerText = user.name;
}

if (user && document.getElementById("userEmail")) {
  document.getElementById("userEmail").innerText = user.email;
}
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

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}
function startResendTimer() {
  const resendBtn = document.getElementById("resendBtn");
  const otpMsg = document.getElementById("otpMsg");

  clearInterval(resendTimer);
  countdown = 30;

  resendBtn.disabled = true;
  resendBtn.innerText = `Resend OTP in ${countdown}s`;

  resendTimer = setInterval(() => {
    countdown--;
    resendBtn.innerText = `Resend OTP in ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(resendTimer);
      resendBtn.disabled = false;
      resendBtn.innerText = "Resend OTP";
      otpMsg.innerText = "You can resend OTP now.";
    }
  }, 1000);
}
function verifyRegisterOTP() {
  const userOtp = document.getElementById("otp").value;

  if (userOtp == generatedOTP) {
    localStorage.setItem("user", JSON.stringify(tempUser));

    alert("Registration Successful ✅");
    window.location.href = "account.html";
  } else {
    alert("Wrong OTP ❌");
  }
}

function googleLogin() {
  alert("Google login coming soon 🚀");
}

function facebookLogin() {
  alert("Facebook login coming soon 🚀");
}

document.addEventListener("DOMContentLoaded", function () {
  toggleLoginType();
});

function sendLoginOTP() {
  const type = document.getElementById("loginType").value;

  if (type === "phone") {
    const phone = document.getElementById("phone").value;

    if (!phone) {
      alert("Enter phone number ❌");
      return;
    }

    generatedOTP = generateOTP();
    alert("OTP sent to phone 📱: " + generatedOTP);
  } else {
    const email = document.getElementById("loginEmail").value;

    if (!email) {
      alert("Enter email ❌");
      return;
    }

    emailOTP = generateOTP();
    alert("OTP sent to email 📧: " + emailOTP);
  }

  // ✅ OTP BOX SHOW
  document.getElementById("loginOtpSection").style.display = "block";

  // ✅ LOGIN BUTTON HIDE
  document.getElementById("loginBtn").style.display = "none";
}

function resendOTP() {
  const type = document.getElementById("loginType").value;
  const otpMsg = document.getElementById("otpMsg");

  if (type === "phone") {
    generatedOTP = generateOTP();
    alert("New OTP sent to phone 📱: " + generatedOTP);
    otpMsg.innerText = "A new OTP has been sent to your phone ✅";
  } else if (type === "email") {
    emailOTP = generateOTP();
    alert("New OTP sent to email 📧: " + emailOTP);
    otpMsg.innerText = "A new OTP has been sent to your email ✅";
  }

  document.getElementById("loginOtp").value = "";
  startResendTimer();
}

function verifyLoginOTP() {
  const type = document.getElementById("loginType").value;
  const otp = document.getElementById("loginOtp").value;
  const otpMsg = document.getElementById("otpMsg");

  if (!otp) {
    otpMsg.innerText = "Please enter OTP ❗";
    return;
  }

  if (type === "phone") {
    if (otp == generatedOTP) {
      otpMsg.innerText = "OTP verified successfully ✅";
      successLogin();
    } else {
      otpMsg.innerText = "Wrong OTP ❌ Please try again or resend.";
      document.getElementById("loginOtp").value = "";
    }
  } else if (type === "email") {
    if (otp == emailOTP) {
      otpMsg.innerText = "OTP verified successfully ✅";
      successLogin();
    } else {
      otpMsg.innerText = "Wrong OTP ❌ Please try again or resend.";
      document.getElementById("loginOtp").value = "";
    }
  }
}
function successLogin() {
  sessionStorage.setItem("isLoggedIn", "true");
  alert("Login Success 🎉");
  window.location.href = "account.html";
}
function loginWithUsername() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!username || !password) {
    alert("Enter username & password ❗");
    return;
  }

  if (user && user.username === username && user.password === password) {
    successLogin();
  } else {
    alert("Invalid Username or Password ❌");
  }
}

function handleLogin() {
  const type = document.getElementById("loginType").value;

  if (type === "username") {
    loginWithUsername(); 
  } else {
    sendLoginOTP(); 
  }
}
