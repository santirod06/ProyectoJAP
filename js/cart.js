document.addEventListener("DOMContentLoaded", function(){
    if (!localStorage.getItem('userRegistered')) {
        window.location.href = 'login.html';
    }
    //Cierre de sesión
    document.getElementById("logOut").addEventListener("click",function(event){
        event.preventDefault();
        localStorage.removeItem('userRegistered');
        window.location.replace("login.html");
    })
    });