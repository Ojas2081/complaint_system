window.addEventListener("pageshow", function (event) {
  console.log("Page was just shown (even via back/forward nav)");

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }

  if (event.persisted) {
    localStorage.removeItem("complaint_id");
    const complaintId = localStorage.getItem("complaint_id");
    console.log("Complaint ID (persisted navigation):", complaintId);

    if (!complaintId) {
      window.location.href = "/complaint-portal/";
      return;
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const complaintId = localStorage.getItem("complaint_id");
  const token = localStorage.getItem("token");

  if (token) {
    if (!complaintId) {
      window.location.href = "/complaint-portal/"; // Redirect to login
      return;
    }
  } else {
    window.location.href = "/";
    return;
  }
  const editBtn = document.getElementById("edit_btn");
  const logoutBtn = document.getElementById("logout_btn");
  editBtn.classList.remove("d-none");
  logoutBtn.classList.remove("d-none");

  const response = await fetch(`/complaints/${complaintId}/`, {
    headers: {
      "Authorization": `Token ${token}`,
      "Content-Type": "application/json"
    },
  });
  const data = await response.json();
//   console.log("no data",data);

  // Populate fields
  document.getElementById("userName").textContent = data.user.first_name + " " + data.user.last_name;
  document.getElementById("category").textContent = data.complaint_type;
  document.getElementById("description").textContent = data.description;
  document.getElementById("status").textContent = data.status;
  document.getElementById("assigned_to").textContent = data.assigned_to;
  document.getElementById("createdAt").textContent = new Date(
    data.created_at
  ).toLocaleString();
  document.getElementById("updatedAt").textContent = new Date(
    data.updated_at
  ).toLocaleString();
  document.getElementById("createdBy").textContent = data.user.email;
  document.getElementById("resolutionMsg").textContent = data.resolution_msg;


  try {
    const response = await fetch("/user/detail/", {  // Replace with your user info endpoint
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    const user = await response.json();

    if (user.is_company_user) {
      document.getElementById("closeTicketBtn").classList.remove("d-none");
    }

  } catch (err) {
    console.error("User check failed", err);
    window.location.href = "/";
  }

    document.getElementById("editSection").classList.remove("d-none");
    document.getElementById("editDescription").value = data.description;
  
});
