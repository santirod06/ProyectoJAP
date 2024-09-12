document.addEventListener("DOMContentLoaded", function() {
    // Obtén el ID del producto del almacenamiento local
    const productId = localStorage.getItem('selectedProductId');
    
    // Verifica si el ID existe
    if (productId) {
        // Hacer una solicitud para obtener la información del producto
        fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la solicitud a la API");
                }
                return response.json();
            })
            .then(product => {
                // Actualiza el contenido de la página con la información del producto
                document.getElementById('product-name').textContent = product.name || 'Nombre no disponible';
                document.getElementById('product-description').textContent = product.description || 'Descripción no disponible';
                document.getElementById('product-category').textContent = product.category || 'Categoría no disponible';
                document.getElementById('product-price').textContent = product.cost !== undefined ? `Precio: $${product.cost.toFixed(2)}` : 'Precio no disponible';
                document.getElementById('product-sold').textContent = product.soldCount !== undefined ? `Vendidos: ${product.soldCount}` : 'Cantidad no disponible';

                // Manejo de imágenes en el carrusel
                const carouselItemsContainer = document.getElementById('carousel-items');
                if (product.images && Array.isArray(product.images)) {
                    product.images.forEach((imageUrl, index) => {
                        // Crear un nuevo div para cada item del carrusel
                        const itemDiv = document.createElement('div');
                        itemDiv.classList.add('carousel-item');
                        
                        // Si es la primera imagen, le damos la clase 'active'
                        if (index === 0) {
                            itemDiv.classList.add('active');
                        }

                        // Crear la imagen y asignarle el src
                        const imgElement = document.createElement('img');
                        imgElement.src = imageUrl;
                        imgElement.classList.add('d-block', 'w-100');
                        imgElement.alt = `Imagen ${index + 1}`;

                        // Añadir la imagen al item del carrusel
                        itemDiv.appendChild(imgElement);

                        // Añadir el item al contenedor del carrusel
                        carouselItemsContainer.appendChild(itemDiv);
                    });
                } else {
                    // Si no hay imágenes, mostrar un mensaje alternativo
                    const noImagesMessage = document.createElement('p');
                    noImagesMessage.textContent = 'No hay imágenes disponibles';
                    carouselItemsContainer.appendChild(noImagesMessage);
                }
            })
            .catch(error => {
                console.error('Error al obtener la información del producto:', error);
            });
    } else {
        console.error('No se encontró el ID del producto en el almacenamiento local.');
    }
});
