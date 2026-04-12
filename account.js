function showSection(sectionId, clickedButton) {
  const sections = document.querySelectorAll(".content-section");
  const links = document.querySelectorAll(".side-link");

  sections.forEach((section) => {
    section.classList.remove("active");
  });

  links.forEach((link) => {
    link.classList.remove("active");
  });

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add("active");
  }

  if (clickedButton) {
    clickedButton.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
function toggleTheme() {
  const html = document.documentElement;
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeLabel");

  html.classList.toggle("dark");

  const isDark = html.classList.contains("dark");

  if (isDark) {
    icon.className = "bi bi-sun";
    label.textContent = "Light";
    localStorage.setItem("theme", "dark");
  } else {
    icon.className = "bi bi-moon-stars";
    label.textContent = "Dark";
    localStorage.setItem("theme", "light");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");

    const icon = document.getElementById("themeIcon");
    const label = document.getElementById("themeLabel");

    if (icon) icon.className = "bi bi-sun";
    if (label) label.textContent = "Light";
  }

  loadProfile();
});
function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : "";
  const last = lastName ? lastName.charAt(0).toUpperCase() : "";
  return first + last || "U";
}

function updateProfileUI(profile) {
  const firstName = profile.firstName || "User";
  const lastName = profile.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const email = profile.email || "user@email.com";
  const initials = getInitials(firstName, lastName);

  document.getElementById("displayName").textContent = fullName;
  document.getElementById("displayEmail").textContent = email;
  document.getElementById("greetingName").textContent = firstName;
  document.getElementById("loyaltyName").textContent = fullName;
  document.getElementById("profileTopName").textContent = fullName;

  document.getElementById("sidebarInitials").textContent = initials;
  document.getElementById("profileInitials").textContent = initials;
}

function saveProfile() {
  const profile = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("emailAddress").value,
    phone: document.getElementById("phoneNumber").value
  };

  localStorage.setItem("tvUserProfile", JSON.stringify(profile));
  updateProfileUI(profile);
  showToast("Profile saved successfully");
}

function loadProfile() {
  const data = localStorage.getItem("tvUserProfile");
  if (!data) return;

  const profile = JSON.parse(data);
  updateProfileUI(profile);

  document.getElementById("firstName").value = profile.firstName || "";
  document.getElementById("lastName").value = profile.lastName || "";
  document.getElementById("emailAddress").value = profile.email || "";
  document.getElementById("phoneNumber").value = profile.phone || "";
}

window.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});
function logoutUser() {
  showToast("Logged out successfully");
  setTimeout(() => {
    window.location.href = "signin.html";
  }, 800);
}