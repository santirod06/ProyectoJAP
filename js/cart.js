document.addEventListener("DOMContentLoaded", function(){
     //Cierre de sesión
    document.getElementById("logOut").addEventListener("click",function(event){
        event.preventDefault();
        localStorage.removeItem('userRegistered');
        window.location.replace("login.html");
    })
    });