function loadProducts() {
    let categoriaID = localStorage.getItem("catID");

    fetch('https://japceibal.github.io/emercado-api/cats_products/' + categoriaID + '.json')

        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la solicitud a la API");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            let productList = document.getElementById('product-list');
            let htmlContentToAppend = '';

            for (let i = 0; i < data.products.length; i++) {
                let product = data.products[i];
                let price = (typeof product.cost === 'number' && !isNaN(product.cost)) ? product.cost.toFixed(2) : 'N/A';
                let soldCount = (typeof product.soldCount === 'number') ? product.soldCount : 'N/A';
                htmlContentToAppend += `
                    <div class="product card mb-4" data-id="${product.id}">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">Precio: $${price}</p>
                            <p class="card-text">Cantidad Vendidos: ${soldCount}</p>
                        </div>
                    </div>
                `;
            }
            productList.innerHTML = htmlContentToAppend;

            // Asignar el evento después de que los productos se hayan cargado
            const products = document.querySelectorAll('.product');
            products.forEach(product => {
                product.addEventListener('click', function() {
                    // Obtén el ID del producto
                    const productId = this.getAttribute('data-id');

                    // Guarda el ID en el almacenamiento local
                    localStorage.setItem('selectedProductId', productId);

                    // Redirige a product-info.html
                    window.location.href = 'product-info.html';
                });
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            document.getElementById('product-list').innerHTML = '<p>Error al cargar los productos.</p>';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});
