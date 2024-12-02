document.addEventListener("DOMContentLoaded", function() {
    let alertDanger = document.getElementById("alert-danger");
    let btnCloseAlert = document.getElementById("btn-close-alert");

    function showAlertError(message = "Credenciales incorrectas.") {
        alertDanger.textContent = message; 
        alertDanger.style = "display:block; opacity: 1";
    }

    function closeAlert() {
        alertDanger.style.display = "none";
        alertDanger.classList.remove('show');
    }

    btnCloseAlert.addEventListener("click", closeAlert);

    document.getElementById("get_into").addEventListener("click", async function(event) {
        event.preventDefault();

        const user = document.getElementById('user').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!user || !password) {
            showAlertError("Por favor completa todos los campos.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: password }),
            });

            if (!response.ok) {
                throw new Error("Credenciales incorrectas.");
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); 
            localStorage.setItem('userRegistered', user); 

            window.location.replace('index.html');
        } catch (error) {
            console.error("Error:", error);
            showAlertError(error.message || "Error al iniciar sesión.");
        }
    });
});
