document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem('userRegistered')) {
        window.location.href = 'login.html';
    }
    
    const cartContainer = document.getElementById('cart-container');
    let cartData = JSON.parse(localStorage.getItem('cartItems')) || []; // Cambiado a let

    let totalUSD = 0;  // Total en dólares
    let totalUYU = 0;  // Total en pesos

    const updateTotals = () => {
        // Reinicia los totales antes de acumular
        totalUSD = 0;
        totalUYU = 0;

        // Acumula en la moneda correspondiente
        cartData.forEach(cartItem => {
            const itemSubtotal = cartItem.cost * cartItem.quantity;
            if (cartItem.currency === 'USD') {
                totalUSD += itemSubtotal;
            } else if (cartItem.currency === 'UYU') {
                totalUYU += itemSubtotal;
            }
        });

        // Actualiza el total en el DOM
        document.getElementById('total').textContent = `Total: USD ${totalUSD.toFixed(2)} + UYU ${totalUYU.toFixed(2)}`;
    };


    // Verifica si el carrito está vacío
    if (cartData.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center">
                <h5>No hay productos en el carrito.</h5>
            </div>
        `;
    }else {
    // Creamos dinámicamente una lista de productos en el carrito
        cartData.forEach(item => {
            const productDiv = document.createElement('div'); 
            productDiv.classList.add('cart-item', 'col-md-12', 'position-relative');

            // Crear el botón de cierre
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
                productDiv.remove(); // Eliminar el producto de la interfaz
                updateTotals(); // Actualizo los totales después de eliminar

                // Verifico si el carrito está vacío 
                if (cartData.length === 0) {
                    cartContainer.innerHTML = `
                        <div class="text-center">
                            <h5>No hay productos en el carrito.</h5>
                        </div>
                    `;
                }
            };

            // Agrego el botón de cierre al div del producto
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

            // Función para calcular subtotal y actualizar totales
            const calculateSubtotal = () => {
                const quantity = parseInt(quantityInput.value);
                const subtotal = item.cost * quantity;
                subtotalText.textContent = `Subtotal: ${item.currency} ${subtotal.toFixed(2)}`;
                item.quantity = quantity; // Actualizo la cantidad del producto en cartData
                updateTotals(); // Actualizo los totales
            };

            calculateSubtotal();
            quantityInput.addEventListener('input', calculateSubtotal);

            // Agregamos los elementos al contenedor
            subtotalDiv.appendChild(subtotalText);

            productRow.appendChild(productInfoDiv);
            quantityDiv.appendChild(quantityInput);
            productRow.appendChild(quantityDiv);
            productRow.appendChild(costDiv);
            productRow.appendChild(subtotalDiv);
            
            productDiv.appendChild(productRow);
            cartContainer.appendChild(productDiv);
        });
    }

    // Cierre de sesión
    document.getElementById("logOut").addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.removeItem('userRegistered');
        window.location.replace("login.html");
    });

    updateTotals(); // Llamada para actualizar totales al cargar la página
});
