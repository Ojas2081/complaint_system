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
        window.location.href = "/company-user-view/";
        return;
      }
    }
  });

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/");
    const editBtn = document.getElementById("edit_btn");
    const logoutBtn = document.getElementById("logout_btn");
    editBtn.classList.remove("d-none");
    logoutBtn.classList.remove("d-none");
  
    const res = await fetch("/dashboard-metrics/", {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    const data = await res.json();
    if (!res.ok) return alert("Access Denied");
  
    // Set KPI cards
    document.getElementById("total").innerText = data.total_complaints;
    document.getElementById("inProgress").innerText = data.in_progress;
    document.getElementById("resolvedPercent").innerText = data.resolved_percentage + "%";
  
    // Pie chart
    new Chart(document.getElementById("statusPieChart"), {
      type: "pie",
      data: {
        labels: Object.keys(data.status_data),
        datasets: [{
          label: "By Status",
          data: Object.values(data.status_data),
          borderWidth: 1,
        }],
      },
    });
  
    // Bar chart
    new Chart(document.getElementById("categoryBarChart"), {
      type: "bar",
      data: {
        labels: Object.keys(data.category_data),
        datasets: [{
          label: "Total Complaints",
          data: Object.values(data.category_data),
          borderWidth: 1,
        }],
      },
    });

    let url = "/complaints/";
    try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) throw new Error("Failed to fetch complaints");
    
        const complaints = await response.json();
        renderComplaintsTable(complaints);
      } catch (err) {
        console.error("Error loading complaints:", err);
        complaintsBody.innerHTML = `<tr><td colspan="6">Error fetching complaints.</td></tr>`;
      }



  });


// const searchInput = document.getElementById("searchInput");
// const complaintsBody = document.getElementById("complaintsTableBody");

// searchInput.addEventListener("keyup", async () => {
//   const query = searchInput.value.trim();
//   console.log("query",query)
//   const token = localStorage.getItem("token");

//   if (!token) {
//     window.location.href = "/";
//     return;
//   }

//   let url = "/complaints/";
//   if (query !== "") {
//     url += `?u=${encodeURIComponent(query)}`;
//   }

//   try {
//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Token ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) throw new Error("Failed to fetch complaints");

//     const complaints = await response.json();
//     renderComplaintsTable(complaints);
//   } catch (err) {
//     console.error("Error loading complaints:", err);
//     complaintsBody.innerHTML = `<tr><td colspan="6">Error fetching complaints.</td></tr>`;
//   }
// });

// function renderComplaintsTable(complaints) {
//   complaintsBody.innerHTML = "";

//   if (complaints.length === 0) {
//     complaintsBody.innerHTML =
//       '<tr><td colspan="6">No complaints found.</td></tr>';
//     return;
//   }

//   complaints.forEach((c,index) => {
//     complaintsBody.innerHTML += `
//       <tr>
//         <td>${c.id}</td>
//         <td>${c.user.first_name + " "+ c.user.last_name || "N/A"}</td>
//         <td>${c.user.email || "N/A"}</td>
//         <td><a onclick="view_complaint(event,${c.id})">  ${c.complaint_type}</a></td>
//         <td>${c.status}</td>
//         <td>${new Date(c.created_at).toLocaleString()}</td>
//       </tr>`;
//   });
// }



document.getElementById("filterBtn").addEventListener("click", filterComplaints);

async function filterComplaints() {
  const token = localStorage.getItem("token");
  if (!token) return alert("Not authorized");

  const name = document.getElementById("searchUser").value.trim();
  const category = document.getElementById("searchCategory").value;
  const status = document.getElementById("searchStatus").value;

  let url = "/complaints/?";
  if (name) url += `u=${encodeURIComponent(name)}&`;
  if (category) url += `c=${encodeURIComponent(category)}&`;
  if (status) url += `s=${encodeURIComponent(status)}&`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    renderComplaintsTable(data);
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById("complaintsBody").innerHTML =
      "<tr><td colspan='6'>Error loading complaints.</td></tr>";
  }
}

function renderComplaintsTable(complaints) {
  const tbody = document.getElementById("complaintsBody");
  tbody.innerHTML = "";

  if (complaints.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>No results found.</td></tr>";
    return;
  }

  complaints.forEach((c, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.user.first_name + " " + c.user.last_name || c.user?.first_name || "N/A"}</td>
        <td>${c.user.email || "N/A"}</td>
        <td><a href="" onclick="view_complaint(event,${c.id})">  ${c.complaint_type}</a></td>
        <td>${c.status}</td>
        <td>${new Date(c.created_at).toLocaleString()}</td>
      </tr>
    `;
  });
}






async function view_complaint(event,id) {
    event.preventDefault()
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/'; // Redirect to login if not authenticated
      return;
    }
    localStorage.setItem("complaint_id", id);
    window.location.href = "/complaint-detail/";
  }

  