document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let errorMsg = document.getElementById("errorMsg");

    // Dummy login credentials
    let correctUsername = "admin";
    let correctPassword = "1234";

    if (username === correctUsername && password === correctPassword) {
        alert("Login Successful!");
        window.location.href = "home.html"; // redirect page
    } else {
        errorMsg.textContent = "Invalid Username or Password";
    }
});