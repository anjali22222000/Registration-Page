function openTab(tabId, element) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");

  document.querySelectorAll(".sidebar li").forEach((li) => {
    li.classList.remove("active");
  });

  if (element) {
    element.classList.add("active");
  }

  if (window.innerWidth <= 992) {
    document.querySelector(".sidebar").classList.remove("open");
  }
}

// LOGOUT
function logout() {
  sessionStorage.removeItem("isLoggedIn");
  alert("Logged out!");
  window.location.href = "login.html";
}

// DARK MODE
function toggleDark() {
  document.body.classList.toggle("dark");
}

// MENU
function toggleMenu() {
  document.querySelector(".sidebar").classList.toggle("open");
}

// EDIT MODAL
function openEdit() {
  const user = JSON.parse(localStorage.getItem("user"));

  document.getElementById("editName").value = user?.name || "";
  document.getElementById("editEmail").value = user?.email || "";
  document.getElementById("editPhone").value = user?.phone || "";

  document.getElementById("editModal").style.display = "flex";
}

function closeEdit() {
  document.getElementById("editModal").style.display = "none";
}

function saveProfile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  user.name = document.getElementById("editName").value;
  user.email = document.getElementById("editEmail").value;
  user.phone = document.getElementById("editPhone").value;

  localStorage.setItem("user", JSON.stringify(user));

  alert("Profile Updated ✅");
  location.reload();
}

// CLOSE MODAL ON OUTSIDE CLICK
window.addEventListener("click", function (e) {
  const modal = document.getElementById("editModal");
  if (e.target === modal) {
    closeEdit();
  }
});

// LOAD USER + AVATAR
window.onload = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    document.getElementById("userName").innerText = user.name || "User Name";
    document.getElementById("userEmail").innerText =
      user.email || "user@email.com";

    const avatar = document.getElementById("avatar");

    if (user.gender === "male") {
      avatar.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    } else if (user.gender === "female") {
      avatar.src = "https://cdn-icons-png.flaticon.com/512/3135/3135789.png";
    } else {
      avatar.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
  }
};
