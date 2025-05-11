document.addEventListener("DOMContentLoaded", function () {
    const editBtn = document.getElementById("edit_btn");
    if (!editBtn) return;
  
    editBtn.addEventListener("click", async function (e) {
      e.preventDefault();
  
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
  
      try {
        const response = await fetch("/user/detail/", {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();

        
  
        if (data.is_company_user) {
          window.location.href = "/edit-users-list/";
        } else {
          localStorage.setItem("edit_user_id", data.id);
          window.location.href = "/edit-profile/";
        }
      } catch (err) {
        console.error("Failed to fetch user details", err);
        window.location.href = "/";
      }
    });
  });
  