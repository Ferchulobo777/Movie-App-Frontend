// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
  
    // Selecciona el formulario del DOM
    const form = document.getElementById('registrationForm');
  
    // Agrega un evento que escuche el evento cuando se envía el formulario
    form.addEventListener('submit', (event) => {
      // Si la validación del formulario no es exitosa
      if (!validacionForm()) {
        // Mostrar mensaje de error general
        alert('El formulario no es válido, por favor corrige los errores.');
        // Evitar el envío del formulario
        event.preventDefault();
      } else {
        // Simular registro exitoso (aquí puedes enviar datos al servidor si es necesario)
        // Por ahora mostramos solo un modal de éxito simulado
        $('#successModal').modal('show'); // Utilizamos jQuery para mostrar el modal
        // Evitar el envío real del formulario para este ejemplo
        event.preventDefault();
      }
    });
  
    // Función principal de validación del formulario
    function validacionForm() {
      let esValido = true;
      // Valida cada campo individualmente y combina el resultado con el estado de validación global
      esValido = validarCampo('name', 'Nombre') && esValido;
      esValido = validarCampo('lastName', 'Apellido') && esValido;
      esValido = validarCampo('email', 'Email') && esValido;
      esValido = validarCampo('password', 'Contraseña') && esValido;
      esValido = validarCampo('repeatPassword', 'Repite Contraseña') && esValido;
      esValido = validarCampo('birthday', 'Fecha de Nacimiento') && esValido;
      esValido = validarCampo('nationality', 'Nacionalidad') && esValido;
      return esValido;
    }
  
    // Función para validar un campo específico por su ID y mostrar errores si es necesario
    function validarCampo(id, nombreCampo) {
      const field = document.getElementById(id);
      const valor = field.value.trim();
      const errorText = document.getElementById(id + '-error');
  
      if (valor === '') {
        setErrorFor(field, errorText, `${nombreCampo} es obligatorio.`);
        return false;
      } else {
        setSuccessFor(field, errorText);
        return true;
      }
    }
  
    // Función para establecer un mensaje de error en un campo y mostrarlo
    function setErrorFor(input, errorText, message) {
      const formGroup = input.closest('.form-group');
      formGroup.classList.add('error');
      errorText.innerText = message;
    }
  
    // Función para establecer el estado de éxito en un campo y borrar cualquier mensaje de error
    function setSuccessFor(input, errorText) {
      const formGroup = input.closest('.form-group');
      formGroup.classList.remove('error');
      errorText.innerText = '';
    }
  });