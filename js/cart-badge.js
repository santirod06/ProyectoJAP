document.addEventListener("DOMContentLoaded", function() {
    let cartData = JSON.parse(localStorage.getItem('cartItems')) || [];

    const updateCartBadge = () => {
        const totalQuantity = cartData.reduce((total, item) => total + item.quantity, 0);
        const badge = document.getElementById('cart-badge');
        if (badge) {
            badge.textContent = totalQuantity > 0 ? totalQuantity : '';
        }
    };

    updateCartBadge(); // Llama la función al cargar la página
});
