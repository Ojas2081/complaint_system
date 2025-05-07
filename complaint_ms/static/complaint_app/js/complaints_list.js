window.addEventListener("pageshow", function () {
  console.log("Page was just shown (even via back/forward nav)");
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }
  const editBtn = document.getElementById("edit_btn");
  const logoutBtn = document.getElementById("logout_btn");
  editBtn.classList.remove("d-none");
  logoutBtn.classList.remove("d-none");

  try {
    const token = localStorage.getItem("token");
    console.log("Token Generated");
    const response = await fetch("/complaints/", {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      console.warn("Token invalid or expired");
      localStorage.removeItem("token");
      window.location.href = "/";
      return;
    }

    const complaints = await response.json();
    const tbody = document.getElementById("complaintsBody");
    const itemCount = document.getElementById("itemCount");

    tbody.innerHTML = "";

    if (complaints.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No complaints found.</td></tr>`;
      itemCount.textContent = "0 Items";
      return;
    }

    complaints.forEach((c, index) => {
      const row = `
          <tr>
            <td>${index + 1}</td>
            <td><a href="" onclick=view_complaint(event,${c.id})>${
        c.complaint_type || "-"
      } </a></td>
            <td>${c.user.full_name || c.user.first_name || "N/A"}</td>
            <td>${c.user.email || "N/A"}</td>
            <td>${new Date(c.created_at).toLocaleString()}</td>
          </tr>
        `;
      tbody.insertAdjacentHTML("beforeend", row);
    });

    itemCount.textContent = `${complaints.length} Item${
      complaints.length > 1 ? "s" : ""
    }`;
  } catch (err) {
    console.error("Failed to load complaints:", err);
    document.getElementById(
      "complaintsBody"
    ).innerHTML = `<tr><td colspan="5">Error loading complaints.</td></tr>`;
  }
});

document
  .getElementById("complaintForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const complaint_type = document.getElementById("complaint_type").value;
    const description = document.getElementById("description").value;
    console.log(token);

    try {
      const response = await fetch("/complaints/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaint_type: complaint_type,
          description: description,
        }),
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();

        $("#successMessage")
          .removeClass("d-none")
          .text("Complaint registered successfully!");
        document.getElementById("complaintForm").reset();
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("addComplaintModal")
        );
        modal.hide();
        location.reload();
        setTimeout(function () {
          $("#successMessage").addClass("d-none");
        }, 3000);

        // Optional: Refresh the list
      } else {
        const errorData = await response.json();
        alert("Failed: " + (errorData.detail || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  });

document
  .getElementById("cancel_button")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    document.getElementById("complaintForm").reset();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addComplaintModal")
    );
    modal.hide();
  });

document
  .getElementById("cross_button")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    document.getElementById("complaintForm").reset();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addComplaintModal")
    );
    modal.hide();
  });

// document.getElementById("").addEventListener("click",async function (e) {
//     e.preventDefault()

// })

async function view_complaint(event,id) {
    event.preventDefault()
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/'; // Redirect to login if not authenticated
      return;
    }
    localStorage.setItem("complaint_id", id);
    window.location.href = "/complaint-detail/";
  
    // try {
    //   const response = await fetch(`/complaints/${id}/`, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Token ${token}`,
    //       'Content-Type': 'application/json'
    //     }
    //   });
  
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch complaint details.');
    //   }
  
    //   const complaintData = await response.json();
    //   console.log(complaintData)
      
    //   // Store the data temporarily
    //   localStorage.setItem('selected_complaint', JSON.stringify(complaintData));
  
    //   // Redirect to detail view page
    //   window.location.href = `/complaint-detail/`;
  
    // } catch (error) {
    //   console.error(error);
    // //   alert("Failed to load complaint details.");
    // }
  }