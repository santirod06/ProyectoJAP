document.addEventListener("DOMContentLoaded", function() {
  // Primero verificamos que el usuario esté registrado para que pueda acceder a la página de my-profile.
  if (!localStorage.getItem('userRegistered')) {
    window.location.replace('login.html');
    alert("Necesitas registrarte antes de acceder a tu perfil");
  } else {
      const emailRegistered = localStorage.getItem('userRegistered');
      document.getElementById('mail').value = emailRegistered;

      const photoProfileSaved = localStorage.getItem('photoProfile'); // guardar en el local storage la foto de perfil
      if (photoProfileSaved) {
          document.getElementById('profile-image').innerHTML = // en caso de tener foto de perfil la mostramos
              `<p>Foto de perfil actual: </p>
              <img src="${photoProfileSaved}" alt="Foto de perfil" style="max-width: 150px; border-radius: 50%;">`;
      } else {
          document.getElementById('profile-image').innerHTML =
              '<p>Aun no subiste ninguna foto de perfil </p>';
      }
    const savedName = localStorage.getItem('name');
    if (savedName) document.getElementById('name').value = savedName;

    const secondSavedName = localStorage.getItem('secondName');
    if (secondSavedName) document.getElementById('secondName').value = secondSavedName;

    const lastnameSaved = localStorage.getItem('lastName');
    if (lastnameSaved) document.getElementById('lastName').value = lastnameSaved;

    const secondLastNameSaved = localStorage.getItem('secondLastname');
    if (secondLastNameSaved) document.getElementById('secondLastName').value = secondLastNameSaved;

    const phoneSaved = localStorage.getItem('number');
    if (phoneSaved) document.getElementById('number').value = phoneSaved;
  }

  // En esta parte verificamos que se hayan llenado todos los campos correctamente para poder guardarlos en el local storage
  document.getElementById('user-data-form').addEventListener('submit', function(event) {
      event.preventDefault();

      const name = document.getElementById('name').value;
      const secondName = document.getElementById('secondName').value;
      const lastName = document.getElementById('lastName').value;
      const secondLastName = document.getElementById('secondLastName').value;
      const email = document.getElementById('mail').value;
      const phone = document.getElementById('number').value;
     // const photoProfile = document.getElementById('profileImage').value;
      const fileImage = document.getElementById('profileImage').files[0]; // guardamos la imagen

      if (name && lastName && email) { // verificamos los mínimos campos obligatorios
          localStorage.setItem('name', name);
          localStorage.setItem('secondName', secondName);
          localStorage.setItem('lastName', lastName);
          localStorage.setItem('secondLastName', secondLastName);
          localStorage.setItem('email', email);
          localStorage.setItem('number', phone);

          if (fileImage) { // verificamos si la imagen se subió
              const reader = new FileReader(); // FileReader lee en forma asincrónica el archivo de la imagen
              reader.onload = function(e) { // ejecutará cuando termine de leer el archivo el FileReader
                  localStorage.setItem('photoProfile', e.target.result); // Guardamos la imagen en Base64
                  document.getElementById('profile-image').innerHTML = // En caso de actualizar la imagen de perfil
                      `<p>Foto de perfil actual:</p>
                      <img src="${e.target.result}" alt="Foto de perfil" style="max-width: 150px; border-radius: 50%;">`;
              };
              reader.readAsDataURL(fileImage); // Convertir a Base64
          }

          alert('Cambios guardados en localStorage.');
      } else {
          alert('Debe completar todos los campos obligatorios');
      }
  });
});
