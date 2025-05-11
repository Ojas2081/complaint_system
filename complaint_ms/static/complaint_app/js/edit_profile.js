window.addEventListener("pageshow", function (event) {
    //   console.log("Page was just shown (even via back/forward nav)");
    
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }
    
      if (event.persisted) {
        localStorage.removeItem("edit_user_id");
        const user_id = localStorage.getItem("edit_user_id");
        console.log("Complaint ID (persisted navigation):", user_id);
    
        if (!user_id) {
          window.location.href = "/complaint-portal/";
          return;
        }
      }
    });

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("edit_user_id");
  
    if (!token) {
      window.location.href = "/";
      return;
    }
  
    try {
      const response = await fetch(`/user/detail/${userId || ""}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const edit_user = await response.json();
  
      // Populate form fields
      document.getElementById("first_name").value = edit_user.first_name || "";
      document.getElementById("last_name").value = edit_user.last_name || "";
      document.getElementById("email").value = edit_user.email || "";
      document.getElementById("phone").value = edit_user.phone_number || "";
      document.getElementById("gender").value = edit_user.gender || "";
      document.getElementById("zipcode").value = edit_user.zipcode || "";
      document.getElementById("address").value = edit_user.address || "";
  
      // Show and check company permission if user is company admin
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
            const permissionDiv = document.getElementById("companyPermission");
            permissionDiv.classList.remove("d-none");
            
        }
        if (user.id == edit_user.id || edit_user.is_company_user){
            document.getElementById("is_company_user").checked = user.is_company_user || false;
        } else{
            document.getElementById("is_company_user").checked = false;
        }
    
      } catch (err) {
        console.error("User check failed", err);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Failed to load user details", err);
    }
  });


  document.getElementById("editProfileForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    const newPassword = document.getElementById("new_password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    const userId = localStorage.getItem("edit_user_id");

    // Validate passwords match
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        document.getElementById("passwordMatchText").classList.remove("d-none");
        return;
      }
      document.getElementById("passwordMatchText").classList.add("d-none");
    }
  
    const payload = {
      first_name: document.getElementById("first_name").value.trim(),
      last_name: document.getElementById("last_name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone_number: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      zipcode: document.getElementById("zipcode").value.trim(),
      gender: document.getElementById("gender").value,
      is_company_user: document.getElementById("is_company_user").checked,
      password: newPassword,
      confirm_password: confirmPassword
    };
    console.log(payload)
  
    try {
      const response = await fetch(`/user/detail/${userId}/`, {  // replace with dynamic user ID
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify(payload)
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("Profile updated successfully.");
        window.location.href = "/complaint-portal/";
      } else {
        alert(result.error || "Something went wrong.");
      }
  
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating profile.");
    }
  });
  
  