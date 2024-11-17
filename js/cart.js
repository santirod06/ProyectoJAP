document.addEventListener("DOMContentLoaded", async function() {
    const cartContainer = document.getElementById('cart-container');
    let cartData = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    let totalUYU = 0;
    let shippingCost = 0;
    
    const shippingOptions = { A: 0.15, B: 0.07, C: 0.05 };
    let exchangeRateUSDToUYU = 0;

    // Función para actualizar el costo de envío
    const updateShippingCost = (subtotal) => {
        if (isNaN(subtotal) || subtotal <= 0) {
            shippingCost = 0;
            return;
        }

        const selectedOption = document.querySelector('input[name="shipping-options"]:checked');
        if (selectedOption) {
            const shippingRate = shippingOptions[selectedOption.value] || 0;
            shippingCost = subtotal * shippingRate;
        } else {
            shippingCost = 0;  
        }

        // Actualizar el costo de envío en el DOM
        const shippingCostElement = document.getElementById('shipping-cost');
        if (shippingCostElement) {
            shippingCostElement.textContent = `Costo de envío: $UYU ${shippingCost.toFixed(2)}`;
        }
    };
    
    // Obtener la tasa de cambio
    const getExchangeRate = async () => {
        try {
            const response = await fetch('https://v6.exchangerate-api.com/v6/cbd61d864d4082309e0ac80d/latest/USD');
            const data = await response.json();
            if (data.result === 'success' && data.conversion_rates && data.conversion_rates.UYU) {
                exchangeRateUSDToUYU = data.conversion_rates.UYU;
            } else {
                console.error("Tasa de cambio no encontrada en la respuesta de la API:", data);
            }
        } catch (error) {
            console.error('Error obteniendo la tasa de cambio:', error);
        }
    };

    await getExchangeRate();
    
    // Actualizar el badge del carrito
    const updateCartBadge = () => {
        const totalQuantity = cartData.reduce((total, item) => total + item.quantity, 0);
        const badge = document.getElementById('cart-badge');
        badge.textContent = totalQuantity > 0 ? totalQuantity : '';
    };

    // Actualizar el subtotal del carrito
    const updateSubtotalCart = () => {
        if (exchangeRateUSDToUYU === 0) {
            console.log("La tasa de cambio aún no ha sido cargada.");
            return;
        }

        let subtotal = 0;
        cartData.forEach(cartItem => {
            const itemSubtotal = cartItem.cost * cartItem.quantity;
            if (cartItem.currency === 'USD') {
                subtotal += itemSubtotal * exchangeRateUSDToUYU; // Convertir a UYU si está en USD
            } else if (cartItem.currency === 'UYU') {
                subtotal += itemSubtotal;
            }
        });

        updateShippingCost(subtotal); 
        const total = subtotal + shippingCost;

        // Actualizar los elementos del DOM con los costos
        const subtotalCart = document.getElementById('subtotal-cart');
        const shippingCostElement = document.getElementById('shipping-cost');
        const totalCostElement = document.getElementById('total-cost');

        subtotalCart.textContent = `Subtotal: $UYU ${subtotal.toFixed(2)}`;
        shippingCostElement.textContent = `Costo de envío: $UYU ${shippingCost.toFixed(2)}`;
        totalCostElement.textContent = `Total: $UYU ${total.toFixed(2)}`;
    };

    // Verificar si el carrito está vacío
    if (cartData.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center">
                <h5>No hay productos en el carrito.</h5>
            </div>
        `;
    } else {
        // Mostrar los productos en el carrito
        cartData.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('cart-item', 'col-md-12', 'position-relative');

            // Botón para eliminar el producto
            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.classList.add('close-button');
            closeButton.onclick = () => {
                cartData = cartData.filter(cartItem => cartItem !== item);
                localStorage.setItem('cartItems', JSON.stringify(cartData));
                productDiv.remove();
                
                // Actualizar los totales después de eliminar un producto
                updateSubtotalCart();
                updateCartBadge();
                updateShippingCost(totalUYU); // Vuelvo a calcular el costo de envío
                if (cartData.length === 0) {
                    cartContainer.innerHTML = `
                        <div class="text-center">
                            <h5>No hay productos en el carrito.</h5>
                        </div>
                    `;
                }
            };

            productDiv.appendChild(closeButton);

            // Contenedor de la fila de producto
            const productRow = document.createElement('div');
            productRow.classList.add('row', 'align-items-center');
            const productInfoDiv = document.createElement('div');
            productInfoDiv.classList.add('col-md-4', 'd-flex', 'align-items-center');

            // Imagen del producto
            const productImg = document.createElement('img');
            productImg.src = item.image;
            productImg.alt = item.name;
            productImg.classList.add('cart-item-img');

            // Nombre del producto
            const productName = document.createElement('h5');
            productName.textContent = item.name;

            productInfoDiv.appendChild(productImg);
            productInfoDiv.appendChild(productName);

            // Costo del producto
            const costDiv = document.createElement('div');
            costDiv.classList.add('col-md-2');
            const costText = document.createElement('p');
            costText.textContent = `${item.currency} ${item.cost.toFixed(2)}`;
            costDiv.appendChild(costText);

            // Cantidad del producto
            const quantityDiv = document.createElement('div');
            quantityDiv.classList.add('col-md-3');
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = item.quantity;
            quantityInput.min = '1';
            quantityInput.classList.add('form-control', 'quantity-input');

            // Subtotal del producto
            const subtotalDiv = document.createElement('div');
            subtotalDiv.classList.add('col-md-3');
            const subtotalText = document.createElement('p');

            // Función para recalcular el subtotal del producto
            const calculateSubtotal = () => {
                const quantity = parseInt(quantityInput.value);
                const subtotal = item.cost * quantity;
                
                item.quantity = quantity;  // Actualizar la cantidad en cartData
                localStorage.setItem('cartItems', JSON.stringify(cartData));
                subtotalText.textContent = `Subtotal: ${item.currency} ${subtotal.toFixed(2)}`;

                updateSubtotalCart();
                updateCartBadge();
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
        });
    }

    // Nos aseguramos que haya una opción de envío seleccionada al cargar la página
    const selectedOption = document.querySelector('input[name="shipping-options"]:checked');
    if (!selectedOption) {
        document.getElementById('standardOption').checked = true;  // Opción predeterminada
    }
    updateShippingCost();  // Actualizamos el costo de envío con la opción seleccionada

    // Evento para cambiar la opción de envío
    const shippingRadios = document.querySelectorAll('input[name="shipping-options"]');
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            updateShippingCost();
            updateSubtotalCart();
        });
    });

    // Llamadas iniciales para actualizar el badge y los totales
    updateCartBadge();
    updateSubtotalCart();

    // Crear divs correspondientes a datos de pago
    const paymentContainer = document.getElementById("paymentContainer");
    const cardPaymentOption = document.getElementById("cardOption");
    const bankTransferPaymentOption = document.getElementById("transferOption");

    // Limpiamos los contenedores de pagos
    function cleanPaymentContainer() {
        paymentContainer.innerHTML = "";
    }

    // Muestra la información de pagos con Tarjeta de Crédito
    function showCardForm() {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("form-section");
        cardDiv.innerHTML = `
            <h4>Detalles de la Tarjeta</h4>
            <label for="card-number">Número de tarjeta:</label>
            <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
            <label for="expiration-date">Fecha de vencimiento:</label>
            <input type="text" id="expiration-date" placeholder="MM/AA" required>
            <label for="cvv">CVV:</label>
            <input type="number" id="cvv" placeholder="123" required>
        `;
        paymentContainer.appendChild(cardDiv);
    }

    // Muestra la información de pagos con Transferencia bancaria
    function showBankForm() {
        const bankDiv = document.createElement("div");
        bankDiv.classList.add("form-section");
        bankDiv.innerHTML = `
            <h4>Detalles de Transferencia Bancaria</h4>
            <label for="titular-name">Nombre del titular:</label>
            <input type="text" id="titular-name" placeholder="Nombre Apellido" required>
            <label for="bank-name">Nombre del Banco:</label>
            <input type="text" id="bank-name" placeholder="Banco Ejemplo" required>
            <label for="numero-cuenta">Número de Cuenta: 1234 5678 9012</label>
        `;
        paymentContainer.appendChild(bankDiv);
    }

    // Validación antes de proceder con la compra
    function validateForm() {
        let isValid = true;

        // Validar los campos según el método de pago seleccionado
        if (cardPaymentOption.checked) {
            const cardNumber = document.getElementById("card-number").value.trim();
            const expirationDate = document.getElementById("expiration-date").value.trim();
            const cvv = document.getElementById("cvv").value.trim();

            if (!cardNumber || !expirationDate || !cvv) {
                isValid = false;
                alert("Por favor, complete todos los campos de la tarjeta.");
            }
        } else if (bankTransferPaymentOption.checked) {
            const titularName = document.getElementById("titular-name").value.trim();
            const bankName = document.getElementById("bank-name").value.trim();

            if (!titularName || !bankName) {
                isValid = false;
                alert("Por favor, complete todos los campos de la transferencia.");
            }
        } else {
            isValid = false;
            alert("Por favor, seleccione un método de pago.");
        }

        return isValid;
    }

    // Escuchar los cambios de método de pago
    cardPaymentOption.addEventListener("change", () => {
        cleanPaymentContainer();
        showCardForm();
    });

    bankTransferPaymentOption.addEventListener("change", () => {
        cleanPaymentContainer();
        showBankForm();
    });

    // Modal para mostrar el estado de la compra
    const completedBuyBtn = document.getElementById("button");
    const completedBuyAnimation = document.getElementById("buy-completed");

    completedBuyBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Evita que la página se recargue
        if (validateForm()) {
            completedBuyAnimation.style.display = "flex";
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 3000); // Redirección después de 3 segundos
        }
    });
});
