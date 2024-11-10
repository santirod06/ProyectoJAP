const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
document.addEventListener("DOMContentLoaded", async function() {
if (!localStorage.getItem('userRegistered')) {
  window.location.href = 'login.html';
}

//Modo noche/día
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

// Badge
let cartData = JSON.parse(localStorage.getItem('cartItems')) || [];

const updateCartBadge = () => {
    const totalQuantity = cartData.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = totalQuantity > 0 ? totalQuantity : '';
    }
};

updateCartBadge(); // Llama la función al cargar la página

// Cierre de sesión
document.getElementById("logOut").addEventListener("click", function(event) {
  event.preventDefault();
  localStorage.removeItem('userRegistered');
  window.location.replace("login.html");
});
});