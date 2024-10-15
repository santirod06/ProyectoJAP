document.addEventListener("DOMContentLoaded", function() {
  // Primero verificamos que el usuario esté registrado para que pueda acceder a la página de my-profile.
  if (!localStorage.getItem('userRegistered')) {
      window.location.href = 'login.html';
      alert("Necesitas registrarte antes de acceder a tu perfil");
  } else {
      const emailRegistrado = localStorage.getItem('userRegistered');
      document.getElementById('mail').value = emailRegistrado;

      const fotoPerfilGuardada = localStorage.getItem('fotoPerfil'); // guardar en el local storage la foto de perfil
      if (fotoPerfilGuardada) {
          document.getElementById('profile-image').innerHTML = // en caso de tener foto de perfil la mostramos
              `<p>Foto de perfil actual: </p>
              <img src="${fotoPerfilGuardada}" alt="Foto de perfil" style="max-width: 150px; border-radius: 50%;">`;
      } else {
          document.getElementById('profile-image').innerHTML =
              '<p>Aun no subiste ninguna foto de perfil </p>';
      }
  }

  // Modo nocturno
  const toggleButton = document.getElementById('toggle-mode');
  const icon = toggleButton.querySelector('i');
  if (localStorage.getItem('mode') === 'dark') {
      document.body.classList.add('dark-mode');
      icon.classList.replace('fa-moon', 'fa-sun');
  }
  toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');

      if (document.body.classList.contains('dark-mode')) {
          icon.classList.replace('fa-moon', 'fa-sun');
          localStorage.setItem('mode', 'dark');
      } else {
          icon.classList.replace('fa-sun', 'fa-moon');
          localStorage.setItem('mode', 'light');
      }
  });

  // En esta parte verificamos que se hayan llenado todos los campos correctamente para poder guardarlos en el local storage
  document.getElementById('formulario').addEventListener('submit', function(event) {
      event.preventDefault();

      const nombre = document.getElementById('name').value;
      const segundoNombre = document.getElementById('secondName').value;
      const apellido = document.getElementById('lastName').value;
      const segundoApellido = document.getElementById('secondLastName').value;
      const email = document.getElementById('mail').value;
      const telefono = document.getElementById('number').value;
      const fotoPerfil = document.getElementById('profileImage').value;
      const archivoImagen = document.getElementById('profileImage').files[0]; // guardamos la imagen

      if (nombre && apellido && email) { // verificamos los mínimos campos obligatorios
          localStorage.setItem('nombre', nombre);
          localStorage.setItem('segundoNombre', segundoNombre);
          localStorage.setItem('apellido', apellido);
          localStorage.setItem('segundoApellido', segundoApellido);
          localStorage.setItem('email', email);
          localStorage.setItem('telefono', telefono);

          if (archivoImagen) { // verificamos si la imagen se subió
              const reader = new FileReader(); // FileReader lee en forma asincrónica el archivo de la imagen
              reader.onload = function(e) { // ejecutará cuando termine de leer el archivo el FileReader
                  localStorage.setItem('fotoPerfil', e.target.result); // Guardamos la imagen en Base64
                  document.getElementById('profile-image').innerHTML = // En caso de actualizar la imagen de perfil
                      `<p>Foto de perfil actual:</p>
                      <img src="${e.target.result}" alt="Foto de perfil" style="max-width: 150px; border-radius: 50%;">`;
              };
              reader.readAsDataURL(archivoImagen); // Convertir a Base64
          }

          alert('Cambios guardados en localStorage.');
      } else {
          alert('Debe completar todos los campos obligatorios');
      }
  });

  // Cierre de sesión
  document.getElementById("logOut").addEventListener("click", function(event) {
      event.preventDefault();
      localStorage.removeItem('userRegistered');
      window.location.replace('login.html');
  });
});
