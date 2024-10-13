document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });

    if (!localStorage.getItem('userRegistered')) {
        window.location.href = 'login.html';
    }

    //localStorage.clear();
   
    const toggleButton = document.getElementById('toggle-mode');
const icon = toggleButton.querySelector('i');

// Verifica la preferencia almacenada en localStorage
if (localStorage.getItem('mode') === 'dark') {
  document.body.classList.add('dark-mode');
  icon.classList.replace('fa-moon', 'fa-sun');
}

// Cambia entre los modos y almacena la preferencia
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
//Cierre de sesión
document.getElementById("logOut").addEventListener("click",function(event){
  event.preventDefault();
  localStorage.removeItem('userRegistered');
  window.location.replace("login.html");
})
});