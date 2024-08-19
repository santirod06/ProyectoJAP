document.addEventListener("DOMContentLoaded", function() {
    const button_ingresar= document.getElementById("get_into");
    button_ingresar.addEventListener("click", function(event) {
    event.preventDefault(); 

    const form= document.getElementById("form_login");
    const user = document.getElementById('user').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!user || !password) {
        alert('Completar todos los campos'); //Modificar, en vez de alerta hacer un cartel
    }else {
        form.submit(); 
        window.location.href = "http://127.0.0.1:5500/index.html";
    }
});
});