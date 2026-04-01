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

    alert("Registered Successfully!");
    window.location.href = "login.html";
  });
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
      alert("Login Successful 🎉");
      window.location.href = "account.html";
    } else {
      alert("Invalid Email or Password ❌");
    }
  });
}