document.addEventListener("DOMContentLoaded", function() {
    // Obtén el ID del producto del almacenamiento local
    const productId = localStorage.getItem('selectedProductId');
    
    // Verifica si el ID existe
    if (productId) {
        // Aquí deberías hacer una solicitud para obtener la información del producto
        fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud a la API");
                }
                return response.json();
            })
            .then(product => {
                // Verifica la estructura de los datos recibidos
                console.log(product);

    
                // Actualiza el contenido de la página con la información del producto
                document.getElementById('product-name').textContent = product.name || 'Nombre no disponible';
                document.getElementById('product-description').textContent = product.description || 'Descripción no disponible';
                document.getElementById('product-category').textContent = product.category || 'Categoría no disponible';
                document.getElementById('product-price').textContent = product.cost !== undefined ? `Precio: $${product.cost.toFixed(2)}` : 'Precio no disponible';
                document.getElementById('product-sold').textContent = product.soldCount !== undefined ? `Vendidos: ${product.soldCount}` : 'Cantidad no disponible';
                // Manejo de imágenes
                const imagesContainer = document.getElementById('product-images');
                if (product.images && Array.isArray(product.images)) {
                    product.images.forEach(imageUrl => {
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.alt = 'Imagen del producto';
                        img.classList.add('img-thumbnail');
                        imagesContainer.appendChild(img);
                    });
                } else {
                    imagesContainer.textContent = 'No hay imágenes disponibles';
                }
            })
            .catch(error => {
                console.error('Error al obtener la información del producto:', error);
            });
    } else {
        // Manejo si no hay ID de producto en el almacenamiento local
        console.error('No se encontró el ID del producto en el almacenamiento local.');
    }
});
