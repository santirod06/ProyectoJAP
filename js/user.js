document.addEventListener('DOMContentLoaded', function() {
    
    const userName = localStorage.getItem('userRegistered');
    
    if (userName) {
      document.getElementById('user-dropdown').textContent = `Bienvenido, ${userName}`;
    } else {
      document.getElementById('user-dropdown').textContent = 'Iniciar sesión';
    }
  });