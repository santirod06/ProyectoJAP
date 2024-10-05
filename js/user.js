document.addEventListener('DOMContentLoaded', function() {
    
    const userName = localStorage.getItem('userRegistered');
    
    if (userName) {
      document.getElementById('usuario').textContent = `Bienvenido, ${userName}`;
    } else {
      document.getElementById('usuario').textContent = 'Iniciar sesión';
    }
  });