document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const message = document.getElementById("message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const pswd = document.getElementById("pswd").value;
    const cnf_pswd = document.getElementById("cnf_pswd").value;

    // Basic validation
    if (!fname || !lname || !email || !pswd || !cnf_pswd) {
      message.textContent = "Please fill in all fields.";
      return;
    }

    if (pswd !== cnf_pswd) {
      message.textContent = "Passwords do not match.";
      return;
    }

    // Generate a simple token (random string)
    const token = Math.random().toString(36).substring(2);

    const user = {
      fname,
      lname,
      email,
      password: pswd,
      token
    };

    // Optional: Save multiple users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(u => u.email === email);

    if (emailExists) {
      message.textContent = "Email already registered.";
      return;
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    message.style.color = "green";
    message.textContent = "Signup successful! Redirecting to login...";

    // Redirect to login after short delay
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  });
});
