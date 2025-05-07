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
  .getElementById("logout_btn")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    localStorage.removeItem("token");

    const csrfToken = getCookie("csrftoken");

    try {
      const response = await fetch("/user/logout/", {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });
      window.location.href = "/";

      const token1 = localStorage.getItem("token");
      console.log("Token value after deletion --> ", token1);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  });
