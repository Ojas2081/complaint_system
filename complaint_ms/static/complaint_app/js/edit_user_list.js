window.addEventListener("pageshow", function (event) {
    //   console.log("Page was just shown (even via back/forward nav)");
  
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
  
    // if (event.persisted) {
    //   localStorage.removeItem("complaint_id");
    //   const complaintId = localStorage.getItem("complaint_id");
    //   console.log("Complaint ID (persisted navigation):", complaintId);
  
    //   if (!complaintId) {
    //     window.location.href = "/complaint-portal/";
    //     return;
    //   }
    // }
  });



document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
  
    try {
      const response = await fetch("/user/register/", {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const users = await response.json();
      const tbody = document.getElementById("userTableBody");
      tbody.innerHTML = "";
  
      users.forEach((user) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.full_name || `${user.first_name} ${user.last_name}`}</td>
          <td>${user.email}</td>
          <td>${user.phone_number || "N/A"}</td>
          <td>${user.gender || "N/A"}</td>
          <td>
            <button class="btn btn-outline-primary btn-sm" onclick="editUser('${user.id}')">Edit</button>
          </td>
        `;
  
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("Failed to load user list:", err);
    }
  });
  
  function editUser(id) {
    localStorage.setItem("edit_user_id", id);
    window.location.href = "/edit-profile/";
  }
  