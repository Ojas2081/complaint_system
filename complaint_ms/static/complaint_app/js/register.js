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

function checkPasswordMatch() {
  const password = $("#password1").val();
  const confirmPassword = $("#password2").val();

  if (password && confirmPassword && password === confirmPassword) {
    $("#passwordMatchIndicator")
      .removeClass("text-danger")
      .addClass("text-success")
      .html("✔ Passwords match");
    return true;
  } else {
    $("#passwordMatchIndicator")
      .removeClass("text-success")
      .addClass("text-danger")
      .html("✖ Passwords do not match");
    return false;
  }
}

$("#password2").on("input", checkPasswordMatch);

$("#registrationForm").submit(function (e) {
  e.preventDefault();

  // Validate non-empty fields
  const requiredFields = [
    "#first_name",
    "#last_name",
    "#email",
    "#password1",
    "#password2",
    "#gender",
    "#contact",
    "#address",
    "#zipcode",
  ];

  let allFilled = true;
  let firstEmptyField = null;

  requiredFields.forEach(function (field) {
    const value = $(field).val();
    if (!value || value === "") {
      $(field).addClass("is-invalid");
      if (!firstEmptyField) {
        firstEmptyField = field; // store the first empty field
      }
      allFilled = false;
    } else {
      $(field).removeClass("is-invalid");
    }
  });

  if (!allFilled) {
    const labelText = $(
      `label[for="${firstEmptyField.replace("#", "")}"]`
    ).text();
    let errorMessage = "Passwords do not match.";
    $("#errorAlertText").text(`Please fill out the "${labelText}" field.`);
    $("#errorAlert").removeClass("d-none");

    // Optional: auto-hide after 5 seconds
    setTimeout(() => {
      $("#errorAlert").addClass("d-none");
    }, 5000);
    return;
  }

  if (!checkPasswordMatch()) {
    let errorMessage = "Passwords do not match.";
    $("#errorAlertText").text(errorMessage);
    $("#errorAlert").removeClass("d-none");

    setTimeout(() => {
      $("#errorAlert").addClass("d-none");
    }, 5000);
    return;
  }

  const csrfToken = getCookie("csrftoken");

  const data = {
    first_name: $("#first_name").val(),
    last_name: $("#last_name").val(),
    email: $("#email").val(),
    password: $("#password1").val(),
    confirm_password: $("#password2").val(),
    gender: $("#gender").val(),
    phone_number: $("#contact").val(),
    address: $("#address").val(),
    zipcode: $("#zipcode").val(),
  };

  $.ajax({
    url: "/user/register/",
    type: "POST",
    headers: {
      "X-CSRFToken": csrfToken,
    },
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response) {
      $("#successMessage")
        .removeClass("d-none")
        .text("User registered successfully!");
      $("#registrationForm")[0].reset();
      $("#passwordMatchIndicator").html("");
      setTimeout(function () {
        $("#successMessage").addClass("d-none");
        window.location.href = "/";
      }, 3000); // Redirect after 3 seconds
    },
    error: function (xhr) {
      let errorMessage = "Registration failed!";

      // Try to extract error message from JSON response
      if (xhr.responseJSON) {
        if (xhr.responseJSON.detail) {
          errorMessage = xhr.responseJSON.detail;
        } else {
          const errors = xhr.responseJSON;
          errorMessage = Object.keys(errors)
            .map((key) => `${key}: ${errors[key]}`)
            .join("\n");
        }
      }

      $("#errorAlertText").text(errorMessage);
      $("#errorAlert").removeClass("d-none");

      // Optional: auto-hide after 5 seconds
      setTimeout(() => {
        $("#errorAlert").addClass("d-none");
      }, 5000);

      console.error("Error:", xhr.responseText);
    },
  });
});
