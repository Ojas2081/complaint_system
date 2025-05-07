function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email) {
      $("#loginErrorText").text("Email field cannot be empty.");
      $("#loginErrorAlert").removeClass("d-none");
      setTimeout(() => $("#loginErrorAlert").addClass("d-none"), 5000);
      return;
    }

    if (!password) {
      $("#loginErrorText").text("Password field cannot be empty.");
      $("#loginErrorAlert").removeClass("d-none");
      setTimeout(() => $("#loginErrorAlert").addClass("d-none"), 5000);
      return;
    }

    const csrfToken = getCookie("csrftoken");

    try {
      const response = await fetch("/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        $("#successMessage")
          .removeClass("d-none")
          .text("Logged in Successfully!");
        $("#loginForm")[0].reset();
        $("#successMessage").addClass("d-none");
        localStorage.setItem("token", data.token);
        window.location.href = "complaint-portal/";
      } else {
        console.error("Login failed:", data.detail);

        $("#loginErrorText").text(
          data.detail || "Login failed. Check credentials."
        );
        $("#loginErrorAlert").removeClass("d-none");

        setTimeout(() => {
          $("#loginErrorAlert").addClass("d-none");
        }, 5000);
      }
    } catch (err) {
      $("#loginErrorText").text("Something went wrong. Please try again.");
      $("#loginErrorAlert").removeClass("d-none");

      setTimeout(() => {
        $("#loginErrorAlert").addClass("d-none");
      }, 5000);
    }
  });
