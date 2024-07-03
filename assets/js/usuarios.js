$(document).ready(function () {
  cargarUsuarios();
  mostrarAnioActual();
  $("#usuarios").DataTable();
  emailUserUpdate();

  // Añadir evento al botón de cerrar sesión
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});

// Función para obtener los headers con el token de autorización
function getHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
}

const apiUrl = "https://movie-app-arwj.onrender.com";

async function cargarUsuarios() {
  try {
    const response = await fetch(apiUrl + "/users", {
      method: "GET",
      headers: getHeaders(),
    });

    if (response.ok) {
      const usuarios = await response.json();
      window.usuarios = usuarios;

      let usuarioHTML = "";

      for (let usuario of usuarios) {
        let btnEditar =
          '<a href="#" onclick="mostrarEditarUsuario(' +
          usuario.user_id +
          ')" class="btn btn-info btn-circle btn-sm" data-toggle="modal" data-target="#editUserModal">' +
          '<i class="fas fa-edit"></i>' +
          "</a>";
        let btnEliminar =
          '<a href="#" onclick="confirmarEliminarUsuario(' +
          usuario.user_id +
          ')" class="btn btn-danger btn-circle btn-sm">' +
          '<i class="fas fa-trash"></i>' +
          "</a>";
        usuarioHTML +=
          "<tr class=background-style>" +
          "<td>" +
          usuario.user_id +
          "</td>" +
          "<td>" +
          usuario.name +
          "</td>" +
          "<td>" +
          usuario.lastName +
          "</td>" +
          "<td>" +
          usuario.email +
          "</td>" +
          "<td>" +
          usuario.password +
          "</td>" +
          "<td>" +
          usuario.dateBirthday +
          "</td>" +
          "<td>" +
          usuario.nationality +
          "</td>" +
          "<td>" +
          btnEditar +
          " " +
          btnEliminar +
          "</td>" +
          "</tr>";
      }

      document.querySelector("#usuarios tbody").innerHTML = usuarioHTML;
    } else {
      console.error(
        "Error al cargar usuarios:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al cargar los usuarios");
  }
}

function confirmarEliminarUsuario(userId) {
  $("#confirmDeleteModal").modal("show");

  document
    .getElementById("confirmDeleteButton")
    .addEventListener("click", function () {
      eliminarUsuario(userId);
      $("#confirmDeleteModal").modal("hide");
    });
}

async function eliminarUsuario(userId) {
  try {
    const response = await fetch(apiUrl + "/users/" + userId, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (response.ok) {
      mostrarMensajeExito("Usuario eliminado con éxito");
      setTimeout(function () {
        $("#successMessage").hide();
        cargarUsuarios();
      }, 1800);
    } else {
      throw new Error("Error al eliminar usuario");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al intentar eliminar el usuario");
  }
}

function mostrarAnioActual() {
  const year = new Date().getFullYear();
  const copyrightSpan = document.getElementById("anioActual");
  if (copyrightSpan) {
    copyrightSpan.textContent = year;
  }
}

function mostrarMensajeExito(mensaje) {
  const successMessage = document.getElementById("successMessage");
  successMessage.innerHTML =
    '<i class="fas fa-check-circle mr-2"></i>' + mensaje;
  successMessage.style.display = "block";
}

function mostrarEditarUsuario(userId) {
  const usuario = window.usuarios.find((u) => u.user_id === userId);

  if (usuario) {
    document.getElementById("editUserId").value = usuario.user_id;
    document.getElementById("editUserName").value = usuario.name;
    document.getElementById("editUserLastName").value = usuario.lastName;
    document.getElementById("editUserEmail").value = usuario.email;
    document.getElementById("editUserPassword").value = usuario.password;
    document.getElementById("editUserDateBirthday").value =
      usuario.dateBirthday;
    document.getElementById("editUserNationality").value = usuario.nationality;

    $("#editUserModal").modal("show");
  }
}

function abrirCrearUsuarioModal() {
  $("#createUserModal").modal("show");
}

function emailUserUpdate() {
  document.getElementById("emailUser").innerText =
    localStorage.getItem("email");
}

function cerrarModalEditar() {
  $("#editUserModal").modal("hide");
  $("#editUserForm").trigger("reset"); // Resetear el formulario de editar usuario
}

document
  .getElementById("editUserForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const userId = document.getElementById("editUserId").value;
    const updatedUser = {
      name: document.getElementById("editUserName").value,
      lastName: document.getElementById("editUserLastName").value,
      email: document.getElementById("editUserEmail").value,
      password: document.getElementById("editUserPassword").value,
      dateBirthday: document.getElementById("editUserDateBirthday").value,
      nationality: document.getElementById("editUserNationality").value,
    };

    try {
      const url = apiUrl + "/users/" + userId;
      const method = "PUT";

      const response = await fetch(url, {
        method: method,
        headers: getHeaders(),
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        mostrarMensajeExito("Usuario actualizado con éxito");
        setTimeout(function () {
          $("#successMessage").hide();
          cargarUsuarios();
          cerrarModalEditar(); // Cerrar el modal después de cargar los usuarios
        }, 1800);
      } else {
        throw new Error("Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al intentar actualizar el usuario");
    }
  });

async function registrarUsuarios() {
  const newUser = {
    name: document.getElementById("name").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    dateBirthday: document.getElementById("birthday").value,
    nationality: document.getElementById("nationality").value,
  };

  try {
    const response = await fetch(apiUrl + "/users", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      mostrarMensajeExito("Usuario registrado con éxito");
      setTimeout(function () {
        $("#successMessage").hide();
        $("#createUserModal").modal("hide");
        cargarUsuarios();
      }, 1800);
    } else {
      throw new Error("Error al registrar usuario");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Hubo un problema al intentar registrar el usuario");
  }
}
// Función para cerrar sesión
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  window.location.href = "./login.html"; // Redireccionar a la página de inicio de sesión
}
