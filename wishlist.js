function removeItem(btn){
  const card = btn.closest(".wish-card");
  card.remove();

  updateCount();
  showToast("Removed from wishlist ❌");
}

function moveToCart(btn){
  const card = btn.closest(".wish-card");
  card.remove();

  updateCount();
  showToast("Moved to cart 🛒");
}

function updateCount(){
  const items = document.querySelectorAll(".wish-card").length;
  document.getElementById("count").textContent = items;

  if(items === 0){
    document.getElementById("emptyState").style.display = "block";
  }
}

/* TOAST */
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");

  setTimeout(()=> t.classList.remove("show"),2000);
}

/* THEME */
function toggleTheme(){
  document.documentElement.classList.toggle("dark");

  const label = document.getElementById("themeLabel");

  if(document.documentElement.classList.contains("dark")){
    label.textContent="Light";
    localStorage.setItem("theme","dark");
  } else {
    label.textContent="Dark";
    localStorage.setItem("theme","light");
  }
}

window.onload = () => {
  if(localStorage.getItem("theme")==="dark"){
    document.documentElement.classList.add("dark");
    document.getElementById("themeLabel").textContent="Light";
  }
};