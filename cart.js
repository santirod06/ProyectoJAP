document.addEventListener("DOMContentLoaded", function() { 
    if (!localStorage.getItem('userRegistered')) {
        window.location.href = 'login.html';
    }
    
    const cartContainer = document.getElementById('cart-container');
    let cartData = JSON.parse(localStorage.getItem('cartItems')) || []; 

    let totalUSD = 0;  // Total en dólares
    let totalUYU = 0;  // Total en pesos

    // Nueva función para actualizar el badge del carrito
    const updateCartBadge = () => {
        const totalQuantity = cartData.reduce((total, item) => total + item.quantity, 0);
        const badge = document.getElementById('cart-badge'); // Asegúrate de que este ID existe en tu HTML
        badge.textContent = totalQuantity > 0 ? totalQuantity : ''; // Actualiza el badge o lo quita si está vacío
    };

    const updateTotals = () => {
        totalUSD = 0;
        totalUYU = 0;

        cartData.forEach(cartItem => {
            const itemSubtotal = cartItem.cost * cartItem.quantity;
            if (cartItem.currency === 'USD') {
                totalUSD += itemSubtotal;
            } else if (cartItem.currency === 'UYU') {
                totalUYU += itemSubtotal;
            }
        });

        document.getElementById('total').textContent = `Total: USD ${totalUSD.toFixed(2)} + UYU ${totalUYU.toFixed(2)}`;
    };

    // Verifica si el carrito está vacío
    if (cartData.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center">
                <h5>No hay productos en el carrito.</h5>
            </div>
        `;
    } else {
        cartData.forEach(item => {
            const productDiv = document.createElement('div'); 
            productDiv.classList.add('cart-item', 'col-md-12', 'position-relative');

            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.classList.add('close-button');
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.background = 'none';
            closeButton.style.border = 'none';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontSize = '20px';

            closeButton.onclick = () => {
                // Eliminar el item del carrito
                cartData = cartData.filter(cartItem => cartItem !== item);
                localStorage.setItem('cartItems', JSON.stringify(cartData));
                productDiv.remove();
                updateTotals();
                updateCartBadge(); // Actualiza el badge después de eliminar

                if (cartData.length === 0) {
                    cartContainer.innerHTML = `
                        <div class="text-center">
                            <h5>No hay productos en el carrito.</h5>
                        </div>
                    `;
                }
            };

            productDiv.appendChild(closeButton);

            const productRow = document.createElement('div');
            productRow.classList.add('row', 'align-items-center'); 
            const productInfoDiv = document.createElement('div');
            productInfoDiv.classList.add('col-md-4', 'd-flex', 'align-items-center');

            const productImg = document.createElement('img');
            productImg.src = item.image; 
            productImg.alt = item.name;
            productImg.classList.add('cart-item-img');

            const productName = document.createElement('h5');
            productName.textContent = item.name;

            productInfoDiv.appendChild(productImg);
            productInfoDiv.appendChild(productName);

            const costDiv = document.createElement('div');
            costDiv.classList.add('col-md-2');
            const costText = document.createElement('p');
            costText.textContent = `${item.currency} ${item.cost.toFixed(2)}`;
            costDiv.appendChild(costText);

            const quantityDiv = document.createElement('div');
            quantityDiv.classList.add('col-md-3');
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = item.quantity;
            quantityInput.min = '1';
            quantityInput.classList.add('form-control', 'quantity-input');

            const subtotalDiv = document.createElement('div');
            subtotalDiv.classList.add('col-md-3');
            const subtotalText = document.createElement('p');

            const calculateSubtotal = () => {
                const quantity = parseInt(quantityInput.value);
                const subtotal = item.cost * quantity;
                subtotalText.textContent = `Subtotal: ${item.currency} ${subtotal.toFixed(2)}`;
                item.quantity = quantity; // Actualiza la cantidad del producto en cartData
                updateTotals();
                updateCartBadge(); // Actualiza el badge con cada cambio de cantidad
            };

            calculateSubtotal();
            quantityInput.addEventListener('input', calculateSubtotal);

            subtotalDiv.appendChild(subtotalText);
            productRow.appendChild(productInfoDiv);
            quantityDiv.appendChild(quantityInput);
            productRow.appendChild(quantityDiv);
            productRow.appendChild(costDiv);
            productRow.appendChild(subtotalDiv);
            productDiv.appendChild(productRow);
            cartContainer.appendChild(productDiv);
        }
)}

    // Cierre de sesión
    document.getElementById("logOut").addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.removeItem('userRegistered');
        window.location.replace("login.html");
    });

    updateCartBadge(); // Llama aquí para actualizar el badge al cargar la página
    updateTotals(); // Llamada para actualizar totales al cargar la página
});
