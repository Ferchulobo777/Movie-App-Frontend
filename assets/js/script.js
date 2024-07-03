document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://movie-app-arwj.onrender.com/movies";
  let currentPage = 1;
  const moviesPerPage = 10;
  let allMovies = [];

  // Función para obtener los encabezados con el token Bearer
  function getHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Función para vaciar el contenedor de películas
  function limpiarContenedorPeliculas(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Vaciar el contenido actual del contenedor
  }

  // Función para crear elementos de película y agregarlos al contenedor adecuado
  function crearElementoPelicula(movie, containerId) {
    const container = document.getElementById(containerId);

    if (containerId === "tendencias-peliculas") {
      // Crear elemento de película para tendencias
      const peliculaDiv = document.createElement("div");
      peliculaDiv.classList.add("peliculas");

      // Enlace a la página de detalle
      const detalleLink = document.createElement("a");
      detalleLink.href = `./detalle.html?id=${movie.movie_id}`;
      peliculaDiv.appendChild(detalleLink);

      // Contenedor de imagen
      const imgDiv = document.createElement("div");
      imgDiv.classList.add("pelicula");
      detalleLink.appendChild(imgDiv);

      // Imagen de la película
      const img = document.createElement("img");
      img.classList.add("img-tendencia");
      img.src = movie.poster;
      img.alt = movie.title;
      imgDiv.appendChild(img);

      // Título de la película
      const title = document.createElement("h4");
      title.classList.add("titulo-pelicula");
      title.textContent = movie.title;
      imgDiv.appendChild(title);

      // Agregar película al contenedor de tendencias
      container.appendChild(peliculaDiv);
    } else if (containerId === "aclamadas-container") {
      // Crear elemento de película para aclamadas
      const peliculaDiv = document.createElement("div");
      peliculaDiv.classList.add("pelicula-item");

      // Enlace a la página de detalle
      const detalleLink = document.createElement("a");
      detalleLink.href = `./detalle.html?id=${movie.movie_id}`;
      peliculaDiv.appendChild(detalleLink);

      // Imagen de la película
      const img = document.createElement("img");
      img.classList.add("img-aclamada");
      img.src = movie.poster;
      img.alt = movie.title;
      detalleLink.appendChild(img);

      // Agregar película al contenedor de aclamadas
      container.appendChild(peliculaDiv);
    }
  }

  // Función para cargar y renderizar películas en la sección de tendencias
  function renderizarPeliculas() {
    limpiarContenedorPeliculas("tendencias-peliculas"); // Vaciar el contenedor antes de renderizar nuevas películas

    const inicio = (currentPage - 1) * moviesPerPage;
    const fin = inicio + moviesPerPage;
    const peliculasARenderizar = allMovies.slice(inicio, fin);

    peliculasARenderizar.forEach((movie) => {
      crearElementoPelicula(movie, "tendencias-peliculas");
    });

    // Actualizar visibilidad de botones de navegación
    actualizarBotonesDeNavegacion();
  }

  // Función para manejar el cambio a la página anterior
  function mostrarPaginaAnterior() {
    if (currentPage > 1) {
      currentPage--;
      renderizarPeliculas();
    }
  }

  // Función para manejar el cambio a la página siguiente
  function mostrarPaginaSiguiente() {
    const totalPages = Math.ceil(allMovies.length / moviesPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderizarPeliculas();
    }
  }

  // Función para actualizar la visibilidad de los botones de navegación
  function actualizarBotonesDeNavegacion() {
    const botonAnterior = document.getElementById("anterior");
    const botonSiguiente = document.getElementById("siguiente");
    const totalPages = Math.ceil(allMovies.length / moviesPerPage);

    if (currentPage === 1) {
      botonAnterior.disabled = true;
    } else {
      botonAnterior.disabled = false;
    }

    if (currentPage === totalPages) {
      botonSiguiente.disabled = true;
    } else {
      botonSiguiente.disabled = false;
    }
  }

  // Función para cargar películas del backend
  function cargarPeliculas() {
    fetch(apiUrl, {
      method: "GET",
      headers: getHeaders(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "La respuesta de la red no fue exitosa " + response.statusText
          );
        }
        return response.json();
      })
      .then((movies) => {
        allMovies = movies;
        renderizarPeliculas();
        renderizarPeliculasAclamadas();
      })
      .catch((error) => {
        console.error("Error al obtener las películas:", error);
      });
  }

  // Función para renderizar las primeras 10 películas en la sección de películas aclamadas
  function renderizarPeliculasAclamadas() {
    const aclamadasContainer = document.getElementById("aclamadas-container");
    const aclamadasMovies = allMovies.slice(0, 10); // Obtener solo las primeras 10 películas

    limpiarContenedorPeliculas("aclamadas-container"); // Vaciar contenido actual

    aclamadasMovies.forEach((movie) => {
      crearElementoPelicula(movie, "aclamadas-container");
    });
  }

  // Llamar a la función para cargar películas al cargar la página
  cargarPeliculas();

  // Añadir eventos a los botones "Anterior" y "Siguiente"
  const botonAnterior = document.getElementById("anterior");
  if (botonAnterior) {
    botonAnterior.addEventListener("click", mostrarPaginaAnterior);
  }

  const botonSiguiente = document.getElementById("siguiente");
  if (botonSiguiente) {
    botonSiguiente.addEventListener("click", mostrarPaginaSiguiente);
  }

  function mostrarEmail() {
    const emailUserElement = document.getElementById("emailUser");
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      emailUserElement.textContent = storedEmail;
    } else {
      emailUserElement.textContent = "Usuario";
    }
  }

  mostrarEmail();

  // Función para cerrar sesión
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "./login.html"; // Redireccionar a la página de inicio de sesión
  }

  // Añadir evento al botón de cerrar sesión
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});
