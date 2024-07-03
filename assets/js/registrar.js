$(document).ready(function () {
  // Asignar el evento de foco a todos los campos de entrada para limpiar los errores
  $("input").on("focus", function () {
    clearFieldError(this.id);
  });
});

const apiUrl = "https://movie-app-arwj.onrender.com";

// Función para obtener los headers con el token de autorización
function getHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.display = "block";
  document
    .getElementById(elementId.replace("-error", ""))
    .classList.add("error");
}

function clearErrors() {
  const errorElements = document.getElementsByClassName("error-message");
  for (let element of errorElements) {
    element.textContent = "";
    element.style.display = "none";
  }
  const inputElements = document.getElementsByClassName("form-control-user");
  for (let element of inputElements) {
    element.classList.remove("error");
  }
}

function clearFieldError(elementId) {
  const errorElement = document.getElementById(elementId + "-error");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
  const inputElement = document.getElementById(elementId);
  if (inputElement) {
    inputElement.classList.remove("error");
  }
}

async function registrarUsuarios() {
  clearErrors();

  let datos = {
    name: document.getElementById("name").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    dateBirthday: document.getElementById("birthday").value,
    nationality: document.getElementById("nationality").value,
  };

  let repetirPassword = document.getElementById("repeatPassword").value;
  let hasError = false;

  if (datos.name === "") {
    showError("name-error", "El nombre es obligatorio.");
    hasError = true;
  }

  if (datos.lastName === "") {
    showError("lastName-error", "El apellido es obligatorio.");
    hasError = true;
  }

  if (datos.email === "") {
    showError("email-error", "El email es obligatorio.");
    hasError = true;
  }

  if (datos.password === "") {
    showError("password-error", "La contraseña es obligatoria.");
    hasError = true;
  }

  if (repetirPassword === "") {
    showError("repeatPassword-error", "Repite la contraseña.");
    hasError = true;
  }

  if (datos.password !== repetirPassword) {
    showError("repeatPassword-error", "Las contraseñas no coinciden.");
    hasError = true;
  }

  if (datos.dateBirthday === "") {
    showError("birthday-error", "La fecha de nacimiento es obligatoria.");
    hasError = true;
  }

  if (datos.nationality === "") {
    showError("nationality-error", "La nacionalidad es obligatoria.");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  try {
    const response = await fetch(apiUrl + "/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }

    document.getElementById("name").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("repeatPassword").value = "";
    document.getElementById("birthday").value = "";
    document.getElementById("nationality").value = "";

    // Mostrar el modal de éxito
    $("#successModal").modal("show");
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al registrar el usuario. Detalles en la consola.");
  }
}
