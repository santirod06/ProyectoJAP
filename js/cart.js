document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem('userRegistered')) {
        window.location.href = 'login.html';
    }
    const cartContainer = document.getElementById('cart-container');
    const cartData = JSON.parse(localStorage.getItem('cartItems')) || [];

    if (cartData.length > 0) {
        cartData.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('cart-item', 'd-flex');

            const productImg = document.createElement('img');
            productImg.src = item.image;
            productImg.alt = item.name; 
            productImg.classList.add('cart-item-img');

            const productInfoDiv = document.createElement('div');
            productInfoDiv.classList.add('cart-item-info');
            productInfoDiv.style.flexGrow = '1';

            const productName = document.createElement('p');
            productName.textContent = `Producto: ${item.name}`;

            const productCost = document.createElement('p');
            productCost.textContent = `Costo: $${item.cost.toFixed(2)} ${item.currency}`;

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = item.quantity;
            quantityInput.min = '1';
            quantityInput.classList.add('quantity-input');

            const subtotal = document.createElement('p');
            const calculateSubtotal = () => {
                const quantity = parseInt(quantityInput.value);
                subtotal.textContent = `Subtotal: $${(item.cost * quantity).toFixed(2)} ${item.currency}`;
            };
            calculateSubtotal();
            quantityInput.addEventListener('input', calculateSubtotal);

            productInfoDiv.appendChild(productName);
            productInfoDiv.appendChild(productCost);
            productInfoDiv.appendChild(quantityInput);
            productInfoDiv.appendChild(subtotal);

            productDiv.appendChild(productImg);
            productDiv.appendChild(productInfoDiv);

            cartContainer.appendChild(productDiv);
        });
    } else {
        cartContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
    }
    
    //Cierre de sesión
    document.getElementById("logOut").addEventListener("click",function(event){
        event.preventDefault();
        localStorage.removeItem('userRegistered');
        window.location.replace("login.html");
    })
});