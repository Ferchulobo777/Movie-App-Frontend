document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  const apiUrl = `https://movie-app-arwj.onrender.com/movies/${movieId}`;

  // Función para obtener los headers con el Bearer token
  function getHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Función para determinar el nombre de la red social a partir del enlace
  function getSocialMediaName(link) {
    if (link.includes("facebook")) return "facebook";
    if (link.includes("x.com") || link.includes("twitter")) return "twitter";
    if (link.includes("instagram")) return "instagram";
    return "default"; // En caso de que no coincida con ninguna red social conocida
  }

  fetch(apiUrl, {
    method: "GET",
    headers: getHeaders(),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((movie) => {
      // Limpiar información anterior
      const tituloElement = document.getElementById("detalle-titulo");
      const fechaGeneroElement = document.getElementById("detalle-fecha-genero");
      const sinopsisElement = document.getElementById("detalle-sinopsis");
      const contenedorCreditos = document.querySelector(".contenedor-creditos");
      const imgPoster = document.getElementById("img-poster");
      const imgDetalle = document.getElementById("img-detalle");
      const iframeTrailer = document.getElementById("detalle-trailer");
      const redesElement = document.querySelector(".redes ul");
      const detalleEstado = document.getElementById("detalle-estado");
      const detalleLenguaje = document.getElementById("detalle-lenguaje");
      const detallePresupuesto = document.getElementById("detalle-presupuesto");
      const detalleGanancias = document.getElementById("detalle-ganancias");

      tituloElement.textContent = "";
      fechaGeneroElement.textContent = "";
      sinopsisElement.textContent = "";
      contenedorCreditos.innerHTML = "";
      imgPoster.src = "";
      imgDetalle.style.backgroundImage = "";
      iframeTrailer.src = "";
      redesElement.innerHTML = "";
      detalleEstado.textContent = "";
      detalleLenguaje.textContent = "";
      detallePresupuesto.textContent = "";
      detalleGanancias.textContent = "";

      // Actualizar el título
      tituloElement.textContent = `${movie.title} (${movie.year})`;

      // Actualizar la fecha y géneros
      const genres = movie.genre.join(", ");
      fechaGeneroElement.textContent = `${movie.datetime} • ${genres}`;

      // Actualizar la sinopsis
      sinopsisElement.textContent = `"${movie.overview}"`;

      // Actualizar el director
      const directorHTML = `
        <div>
          <p>Director</p>
          <h3>${movie.director.name} ${movie.director.lastname}</h3>
        </div>
      `;
      contenedorCreditos.insertAdjacentHTML("beforeend", directorHTML);

      // Actualizar el poster
      imgPoster.src = movie.poster;

      // Actualizar el wallpaper (si es necesario)
      if (movie.wallpaper) {
        imgDetalle.style.backgroundImage = `url('${movie.wallpaper}')`;
      }

      // Actualizar el trailer
      iframeTrailer.src = movie.trailer;

      // Actualizar los enlaces sociales si existen
      if (movie.socialLinks && movie.socialLinks.length > 0) {
        movie.socialLinks.forEach((link) => {
          if (link) {
            const socialMediaName = getSocialMediaName(link);
            const redSocialHTML = `
              <li><a href="${link}" target="_blank" rel="noopener noreferrer"><img src="../assets/img/${socialMediaName}.svg" alt="logo-${socialMediaName}"></a></li>
            `;
            redesElement.insertAdjacentHTML("beforeend", redSocialHTML);
          }
        });
      }

      // Agregar el sitio web si existe
      if (movie.website) {
        const websiteHTML = `
          <li><a href="${movie.website}" target="_blank" rel="noopener noreferrer"><img src="../assets/img/homepage.svg" alt="logo-homepage"></a></li>
        `;
        redesElement.insertAdjacentHTML("beforeend", websiteHTML);
      }

      // Actualizar la información adicional
      detalleEstado.textContent = movie.status ? "Estrenada" : "No Estrenada";
      detalleLenguaje.textContent = movie.originalLanguage;
      detallePresupuesto.textContent = `US$ ${movie.budget.toLocaleString()}`;
      detalleGanancias.textContent = `US$ ${movie.revenue.toLocaleString()}`;
    })
    .catch((error) => {
      console.error("Error fetching movie details:", error);
      // Aquí podrías manejar el error mostrando un mensaje al usuario, por ejemplo.
    });

  // Función para mostrar el email en el dropdown
  function mostrarEmail() {
    const emailUserElement = document.getElementById("emailUser");
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      emailUserElement.textContent = storedEmail;
    } else {
      emailUserElement.textContent = "Usuario";
    }
  }

  mostrarEmail(); // Llamar la función para mostrar el email al cargar la página
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
