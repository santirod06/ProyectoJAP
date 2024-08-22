document.addEventListener("DOMContentLoaded", function() {
    let alertDanger = document.getElementById("alert-danger");
    let btnCloseAlert = document.getElementById("btn-close-alert");
     function showAlertError() {
         alertDanger.style = "display:block; opacity: 1";
     }
     
     function closeAlert() {
             alertDanger.style.display = "none";
             alertDanger.classList.remove('show'); 
         }
      btnCloseAlert.addEventListener("click", closeAlert);
     
 
 document.getElementById("get_into").addEventListener("click", function(event) {
     event.preventDefault(); 
 
     const user = document.getElementById('user').value.trim();
     const password = document.getElementById('password').value.trim();
 
     if (!user || !password) {
         showAlertError(); 
     } else {
         window.location.href = 'index.html';   
     }
 });
 });
 
 