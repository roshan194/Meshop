document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Debug logs
  console.log("Stored token:", token);
  console.log("Stored users:", users);

  // Redirect if token is not found
  if (!token) {
    alert("Unauthorized! Please login first.");
    window.location.href = "../login";
    return;
  }

  // Find user with the same token
  const currentUser = users.find(user => user.token === token);

  // Redirect if token is invalid
  if (!currentUser) {
    alert("Invalid session. Please login again.");
    localStorage.removeItem("token");
    window.location.href = "../login";
    return;
  }

  // Prefill profile info
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  firstNameInput.value = currentUser.fname || "";
  lastNameInput.value = currentUser.lname || "";

  // Save updated profile info
  document.getElementById("saveInfo").addEventListener("click", () => {
    currentUser.fname = firstNameInput.value;
    currentUser.lname = lastNameInput.value;
    updateUser(currentUser);
    alert("Profile updated!");
    firstNameInput.value = "";
    lastNameInput.value = "";
  });

  // Change password logic
  document.getElementById("changePassword").addEventListener("click", () => {
    const oldP = document.getElementById("oldPassword").value;
    const newP = document.getElementById("newPassword").value;
    const confirmP = document.getElementById("confirmNewPassword").value;

    if (oldP !== currentUser.password) {
      alert("Old password is incorrect.");
      return;
    }

    if (newP !== confirmP) {
      alert("New passwords do not match.");
      return;
    }

    currentUser.password = newP;
    updateUser(currentUser);
    alert("Password updated!");
    oldP.value = "";
    newP.value = "";
    confirmP.value = "";
  });

  // Logout
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../login";
  });

  // Helper: Update user in localStorage
  function updateUser(updatedUser) {
    const index = users.findIndex(u => u.email === updatedUser.email);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }
  }
});
