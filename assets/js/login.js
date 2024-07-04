$(document).ready(function () {
  // Cargar usuario recordado al cargar la página
  loadRememberedUser();
});

const apiUrl = "https://movie-app-arwj.onrender.com";

async function iniciarSesion() {
  if (!validarFormulario()) {
    return;
  }

  let datos = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(apiUrl + "/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(datos),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const token = await response.text(); // Obtener el token JWT como texto

    // Guardar token y email en localStorage después del inicio de sesión exitoso
    localStorage.setItem("token", token);
    localStorage.setItem("email", datos.email);
    console.log(
      "Token guardado en localStorage:",
      localStorage.getItem("token")
    );

    // Redirigir al usuario a la página principal después del inicio de sesión exitoso
    window.location.href = "/pages/home.html";
  } catch (error) {
    console.error("Error:", error);
    if (error.name === "AbortError") {
      console.error("Request timed out");
    }
    mostrarErrorModal(
      "Hubo un problema al intentar iniciar sesión. Por favor, verifica tus credenciales e intenta nuevamente."
    );
  }
}

function mostrarErrorModal(mensaje) {
  document.getElementById("errorMessage").innerText = mensaje;
  $("#errorModal").modal("show");
}

function validarFormulario() {
  let esValido = true;
  esValido = validarCampo("email", "Email") && esValido;
  esValido = validarCampo("password", "Contraseña") && esValido;
  return esValido;
}

function validarCampo(id, nombreCampo) {
  const field = document.getElementById(id);
  const valor = field.value.trim();
  const errorText = document.getElementById(id + "-error");

  if (valor === "") {
    setErrorFor(field, errorText, `${nombreCampo} es obligatorio.`);
    return false;
  } else {
    setSuccessFor(field, errorText);
    return true;
  }
}

function setErrorFor(input, errorText, message) {
  const formGroup = input.closest(".form-group");
  formGroup.classList.add("error");
  errorText.innerText = message;
}

function setSuccessFor(input, errorText) {
  const formGroup = input.closest(".form-group");
  formGroup.classList.remove("error");
  errorText.innerText = "";
}

function loadRememberedUser() {
  const rememberedEmail = localStorage.getItem("email");

  if (rememberedEmail) {
    document.getElementById("email").value = rememberedEmail;
    document.getElementById("customCheck").checked = true; // Marcar la casilla "Recuérdame"
  }
}
