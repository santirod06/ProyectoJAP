document.addEventListener("DOMContentLoaded", function() {
    const button_ingresar= document.getElementById("get_into");
    button_ingresar.addEventListener("click", function(event) {
    event.preventDefault(); 

    const form= document.getElementById("form_login");
    const user = document.getElementById('user').value.trim();
    const password = document.getElementById('password').value.trim();

    document.getElementById("get_into").onclick = function() {
        if (!user || !password) {
            alert('Completar todos los campos'); 
        } else {
                window.location.href = 'index.html';   
        }
    }

    if (user && password) {
        localStorage.setItem('userRegistered', user);
        window.location.href = 'index.html';
    }
});
});
