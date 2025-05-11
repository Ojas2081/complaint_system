window.addEventListener("pageshow", function (event) {
  //   console.log("Page was just shown (even via back/forward nav)");

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
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  //   console.log("no data",data);

  // Populate fields
  document.getElementById("userName").textContent =
    data.user.first_name + " " + data.user.last_name;
  document.getElementById("category").textContent = data.complaint_type;
  document.getElementById("description").textContent = data.description;
  document.getElementById("status").textContent = data.status;
//   document.getElementById("assigned_to").textContent = data.assigned_to  ;
  document.getElementById("createdAt").textContent = new Date(
    data.created_at
  ).toLocaleString();
  document.getElementById("updatedAt").textContent = new Date(
    data.updated_at
  ).toLocaleString();
  document.getElementById("createdBy").textContent = data.user.email;
  document.getElementById("resolutionMsg").textContent = data.resolution_msg;


  
  if (!data.assigned_to || data.assigned_to===""){
    document.getElementById("assigned_to").textContent = "None"
  }else{


  const response_assigned_to = await fetch(`/user/detail/${data.assigned_to || ""}/`, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  const assigned_to_user = await response_assigned_to.json();
  document.getElementById("assigned_to").textContent = assigned_to_user.first_name + " " + assigned_to_user.last_name;
}



if (data.file) {
    const fileLink = document.getElementById("fileLink");
    const fileRow = document.getElementById("fileRow");
  
    fileLink.href = data.file;
    fileLink.textContent = "View Attached File";
    fileRow.style.display = "flex"; // or "block" if needed
  }






  try {
    const response = await fetch("/user/detail/", {
      // Replace with your user info endpoint
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
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
  document.getElementById("editDescriptionuser").textContent = data.description;
  // document.getElementById("editCategoryuser").textContent = data.complaint_type;
  document.getElementById("editCategoryuser").value = data.complaint_type;
});

document
  .getElementById("closeTicketBtn")
  .addEventListener("click", async () => {
    const complaintId = localStorage.getItem("complaint_id");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/complaints/${complaintId}/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      const complaint = await response.json();

      // Populate modal
      document.getElementById("modalComplaintType").innerText =
        complaint.complaint_type;
      document.getElementById("modalDescription").innerText =
        complaint.description;
      document.getElementById("modalResolutionMsg").value =
        complaint.resolution_msg || "";
      console.log(complaint.status);
      document.getElementById("modalStatus").value = complaint.status;

      const response_1 = await fetch("/user/register/", {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      const c_user = await response_1.json();
      console.log(c_user);

      const companyUsers = c_user.filter((c_user) => c_user.is_company_user);
      console.log(companyUsers);
      const select = document.getElementById("modalAssignedTo");
      select.innerHTML = '<option value="">-- Select Company User --</option>';

      companyUsers.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = `${user.first_name} ${user.last_name}`;
        select.appendChild(option);
      });

      const modal = new bootstrap.Modal(
        document.getElementById("closeTicketModal")
      );
      modal.show();
    } catch (err) {
      console.error("Failed to fetch complaint details", err);
    }
  });

async function submitCloseTicket() {
  let status = document.getElementById("modalStatus").value;
  let resolution_msg = document.getElementById("modalResolutionMsg").value;
  let assigned_to = document.getElementById("modalAssignedTo").value;


  if (!status || status === "" || !resolution_msg || resolution_msg == "") {
    alert("Field cannot be empty");
    return;
  }
  const complaintId = localStorage.getItem("complaint_id");
  const token = localStorage.getItem("token");
  console.log(assigned_to)

  const data = {
    status: status,
    resolution_msg: resolution_msg,
  };
  if (assigned_to){
    data.assigned_to = parseInt(assigned_to);
  }
  console.log(data,"data")

  try {
    const response = await fetch(`/complaints/${complaintId}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Complaint successfully updated.");
      location.reload();
    } else {
      const err = await response.json();
      alert(err.detail || "Failed to update complaint.");
    }
  } catch (error) {
    console.error("Error closing complaint:", error);
    alert("Error occurred while updating complaint.");
  }
}

document
  .getElementById("cancel_button")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    document.getElementById("modalStatus").value = "";
    document.getElementById("modalResolutionMsg").value = "";
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("closeTicketModal")
    );
    modal.hide();
  });

document
  .getElementById("cross_button")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    document.getElementById("modalStatus").value = "";
    document.getElementById("modalResolutionMsg").value = "";
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("closeTicketModal")
    );
    modal.hide();
  });

// async function updateDescription() {
//   const complaintId = localStorage.getItem("complaint_id");
//   const token = localStorage.getItem("token");
//   const updatedDescriptiontext = document.getElementById(
//     "editDescriptionuser"
//   ).value;
//   const editCategoryuserval = document.getElementById("editCategoryuser").value;
//   console.log("aaa", updatedDescriptiontext);

//   if (!updatedDescriptiontext || updatedDescriptiontext === "") {
//     alert("Description cannot be empty.");
//     return;
//   }
//   if (!editCategoryuserval || editCategoryuserval === "") {
//     alert("Category cannot be empty.");
//     return;
//   }

//   try {
//     const response = await fetch(`/complaints/${complaintId}/`, {
//       method: "PATCH",
//       headers: {
//         Authorization: `Token ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         description: updatedDescriptiontext,
//         complaint_type: editCategoryuserval,
//       }),
//     });

//     if (response.ok) {
//       alert("Description updated successfully.");
//       location.reload();
//     } else {
//       const errorData = await response.json();
//       alert(errorData.detail || "Failed to update description.");
//     }
//   } catch (error) {
//     console.error("Error updating description:", error);
//     alert("An error occurred.");
//   }
// }

async function updateDescription() {
    const complaintId = localStorage.getItem("complaint_id");
    const token = localStorage.getItem("token");
    const updatedDescriptiontext = document.getElementById("editDescriptionuser").value;
    const editCategoryuserval = document.getElementById("editCategoryuser").value;
    const fileInput = document.getElementById("editFile");
  
    if (!updatedDescriptiontext) {
      alert("Description cannot be empty.");
      return;
    }
    if (!editCategoryuserval) {
      alert("Category cannot be empty.");
      return;
    }
  
    const formData = new FormData();
    formData.append("description", updatedDescriptiontext);
    formData.append("complaint_type", editCategoryuserval);
  
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }
  
    try {
      const response = await fetch(`/complaints/${complaintId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`
          // ❌ Don't set Content-Type manually for FormData
        },
        body: formData,
      });
  
      if (response.ok) {
        alert("Complaint updated successfully.");
        location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Failed to update complaint.");
      }
    } catch (error) {
      console.error("Error updating complaint:", error);
      alert("An error occurred.");
    }
  }
  