document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      // ✅ Simulate token creation
      const token = Math.random().toString(36).substring(2);
      matchedUser.token = token;

      // ✅ Save token separately
      localStorage.setItem("token", token);

      // ✅ Update the users array with the token
      const updatedUsers = users.map(user =>
        user.email === matchedUser.email ? { ...user, token } : user
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Optionally store current user
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));

      alert("Login successful!");

      // ✅ Redirect
      window.location.href = "/profile";
    } else {
      alert("User not found. Redirecting to signup...");
      window.location.href = "/signup";
    }
  });
});
