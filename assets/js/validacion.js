document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está autenticado al cargar la página
  verificarAutenticacion();

  // Obtener todos los enlaces a la página de inicio
  const enlacesHome = document.querySelectorAll(
    '.nav-list-item a[href="./pages/home.html"]'
  );

  // Iterar sobre cada enlace y agregar un evento de clic
  enlacesHome.forEach((enlace) => {
    enlace.addEventListener("click", (event) => {
      // Verificar si el usuario está autenticado al hacer clic en el enlace
      if (!estaAutenticado()) {
        // Si no está autenticado, prevenir la navegación a la página de inicio
        event.preventDefault();
        // Mostrar un mensaje de error o redirigir a la página de inicio de sesión
        alert("Debes iniciar sesión para acceder a la página de inicio.");
        // Podrías redirigir al usuario a la página de inicio de sesión en lugar de mostrar una alerta
      }
    });
  });

  // Función para verificar si el usuario está autenticado
  function estaAutenticado() {
    // Verificar si hay un indicador de autenticación en el SesionStorage
    return sessionStorage.getItem("autenticado") === "true";
  }

  // Función para verificar la autenticación al cargar la página
  function verificarAutenticacion() {
    // Si el usuario no está autenticado, eliminar cualquier indicador de autenticación en el SesionStorage
    if (!estaAutenticado()) {
      sessionStorage.removeItem("autenticado");
    }
  }

  // Seleccionar el Formulario del DOM
  const form = document.getElementById("loginForm");

  // Agregar un evento que escuche el evento cuando se envía el formulario
  form.addEventListener("submit", (event) => {
    // Si la validación del formulario no es exitosa
    if (!validacionForm()) {
      // Mostramos una alerta de que el formulario no es válido
      alert("El Formulario no es válido, por favor corrige los errores");
      // Evitar el envío del formulario
      event.preventDefault();
    } else {
      // Si la validación del formulario es exitosa
      alert("Formulario Válido, Enviando...");
      // Evitar el envío real para la simulación
      event.preventDefault();
      // Simular autenticación
      sessionStorage.setItem("autenticado", "true");
      // Redirigir a la página de inicio
      window.location.href = "./pages/home.html";
    }
  });

  // Función para validar el formulario
  function validacionForm() {
    let esValido = true;
    // Validar el campo de Email
    esValido = validarCampoEmail("email") && esValido;
    // Validar el campo de la Contraseña
    esValido = validarCampoPassword("password") && esValido;
    return esValido;
  }

  // Función para validar el campo Email
  function validarCampoEmail(id) {
    // Obtener el elemento del campo de email mediante su ID
    const field = document.getElementById(id);
    // Obtiene el valor del campo y elimina los espacios en blanco al principio y al final
    const email = field.value.trim();

    if (email === "") {
      // Establecemos un mensaje de error para el campo email
      setErrorFor(field, "El correo electrónico es obligatorio");
      // Devolvemos false indicando que ha fallado la validación
      return false;
    } else if (!esEmail(email)) {
      // Establece un mensaje de error para el campo de correo electrónico
      setErrorFor(field, "El correo electrónico no es válido");
      // Nuevamente devolvemos false indicando que no es correcta su validación
      return false;
    } else {
      // Si no, el campo de correo electrónico es válido, elimina cualquier mensaje de error anterior
      setSuccessFor(field);
      // Devolvemos true indicando que la validación es correcta
      return true;
    }
  }

  // Función para validar el campo Password
  function validarCampoPassword(id) {
    // Obtener el elemento del campo de contraseña mediante su ID
    const field = document.getElementById(id);
    // Obtiene el valor del campo y elimina los espacios en blanco al principio y al final
    const password = field.value.trim();

    if (password === "") {
      // Establecemos un mensaje de error para el campo contraseña
      setErrorFor(field, "La contraseña es obligatoria");
      // Devolvemos false indicando que ha fallado la validación
      return false;
    } else if (!esPassword(password)) {
      // Establecemos un mensaje de error para el campo contraseña
      setErrorFor(
        field,
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial"
      );
      // Devolvemos false indicando que ha fallado la validación
      return false;
    } else {
      // Si no, el campo de contraseña es válido, elimina cualquier mensaje de error anterior
      setSuccessFor(field);
      // Devolvemos true indicando que la validación es correcta
      return true;
    }
  }

  // Función para establecer un mensaje de error en un campo
  const setErrorFor = (input, message) => {
    // Encuentra el elemento padre del campo de entrada
    const formControl = input.closest("div");
    // Encuentra el elemento de texto de error dentro del elemento padre
    const errorText = formControl.querySelector(".texto-error");
    // Agrega la clase de error al elemento padre para resaltar el campo
    formControl.classList.add("error");
    // Establece el texto del mensaje de error
    errorText.innerText = message;
    // Establece el foco en el campo de entrada para una corrección rápida
    input.focus();
  };

  // Función auxiliar para validar el formato del email
  function esEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Función auxiliar para validar el formato del password
  function esPassword(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  // Función para establecer éxito en un campo
  const setSuccessFor = (input) => {
    // Encuentra el elemento padre del campo de entrada
    const formControl = input.closest("div");
    // Elimina la clase de error si está presente
    formControl.classList.remove("error");
    // Encuentra el elemento de texto de error dentro del elemento padre
    const errorText = formControl.querySelector(".texto-error");
    // Limpia cualquier mensaje de error anterior
    errorText.innerText = "";
  };
});
