document.addEventListener("DOMContentLoaded", function () {
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
                document.getElementById('product-price').textContent = product.cost !== undefined ? `Precio: $${product.cost.toFixed(2)}` : 'Precio no disponible';
                document.getElementById('product-sold').textContent = product.soldCount !== undefined ? `Vendidos: ${product.soldCount}` : 'Cantidad no disponible';

                // Manejo de imágenes en el carrusel
                const carouselItemsContainer = document.getElementById('carousel-items');
                if (product.images && Array.isArray(product.images)) {
                    product.images.forEach((imageUrl, index) => {
                        const itemDiv = document.createElement('div');
                        itemDiv.classList.add('carousel-item');

                        if (index === 0) {
                            itemDiv.classList.add('active');
                        }

                        const imgElement = document.createElement('img');
                        imgElement.src = imageUrl;
                        imgElement.classList.add('d-block', 'w-100');
                        imgElement.alt = `Imagen ${index + 1}`;

                        itemDiv.appendChild(imgElement);
                        carouselItemsContainer.appendChild(itemDiv);
                    });
                } else {
                    const noImagesMessage = document.createElement('p');
                    noImagesMessage.textContent = 'No hay imágenes disponibles';
                    carouselItemsContainer.appendChild(noImagesMessage);
                }
            })
            .catch(error => {
                console.error('Error al obtener la información del producto:', error);
            });

            // Función para cargar y mostrar comentarios de la API
            function loadComments() {
                fetch(`https://japceibal.github.io/emercado-api/products_comments/` + productId + `.json`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud a la API`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const commentsContainer = document.getElementById(`comments-container`);
                    commentsContainer.innerHTML = ` `; // Limpiar contenido previo

                    // Recorremos los comentarios y los agregamos al contenedor
                    data.forEach(comment => {
                        const commentDiv = document.createElement(`div`);
                        commentDiv.classList.add(`comentario`, `my-3`, `p-2`, `border`);

                        const name = document.createElement(`div`);
                        name.classList.add(`nombre`);
                        name.textContent = comment.user;

                        const date = document.createElement(`div`);
                        date.classList.add(`fecha`);
                        date.textContent = new Date(comment.dateTime).toLocaleDateString();
                        
                        const rating = document.createElement(`div`);
                        rating.classList.add(`calificacion`);

                        // Generar las estrellas
                        let stars = ` `;
                        for (let i = 1; i <= 5; i++) {
                            stars += `<i class="fas fa-star ${i <= comment.score ? `text-warning` : `text-muted`}"></i>`;
                        }
                        rating.innerHTML = stars;

                        const text = document.createElement(`div`);
                        text.textContent = comment.description;

                        // Agrega todos los comentarios al div del comentario
                        commentDiv.appendChild(name);
                        commentDiv.appendChild(date);
                        commentDiv.appendChild(rating);
                        commentDiv.appendChild(text);

                        commentsContainer.appendChild(commentDiv);
                    });
                })
                .catch(error => {
                    console.error(`Error al cargar los comentarios:`, error);
                    const commentsContainer = document.getElementById(`comments-container`);
                    commentsContainer.innerHTML = `<p>Error al cargar los comentarios</p>`;
                });

        }

        loadComments();
        
        // Parte de enviar y escribir comentarios
        const sendButton = document.querySelector('.btn-primary'); // Creamos una constante para el boton de enviar
        sendButton.addEventListener('click', () => { // Le añadimos funcionalidad
            const nameInput = document.getElementById('input-name').value; 
            const dateInput = document.getElementById('input-date').value; // Creamos una constante para obtener    //
            const opinionInput = document.querySelector('textarea').value; // Cada una de las casillas que llenamos //
            const ratingInput = document.querySelector('input[name="rating"]:checked'); 

            if (nameInput && dateInput && opinionInput && ratingInput) { // verificamos si todos los campos están completos
                const score = ratingInput.value; // hay que guardarlo en una constante porque si no se rompe 

                const newComment = { // creamos un objeto con la información correspondiente del
                    user: nameInput,
                    dateTime: dateInput,
                    description: opinionInput,
                    score: score 
                };

                // Crear el div para el nuevo comentario
                const commentDiv = document.createElement('div');
                commentDiv.classList.add(`comentario`, `my-3`, `p-2`, `border`); // Usar el mismo estilo que los comentarios de la API

                // Crear y agregar el nombre
                const name = document.createElement(`div`);
                name.classList.add(`nombre`);
                name.textContent = newComment.user;
                commentDiv.appendChild(name);

                // Crear y agregar la fecha
                const date = document.createElement(`div`);
                date.classList.add(`fecha`);
                date.textContent = new Date(newComment.dateTime).toLocaleDateString();
                commentDiv.appendChild(date);

                // Crear y agregar la calificación con estrellas
                const rating = document.createElement(`div`);
                rating.classList.add(`calificacion`);
                let stars = ` `;
                for (let i = 1; i <= 5; i++) {
                    stars += `<i class="fas fa-star ${i <= newComment.score ? `text-warning` : `text-muted`}"></i>`;
                }
                rating.innerHTML = stars;
                commentDiv.appendChild(rating);

                // Crear y agregar el texto del comentario
                const text = document.createElement(`div`);
                text.textContent = newComment.description;
                commentDiv.appendChild(text);

                const commentsContainer = document.getElementById('comments-container');
                commentsContainer.appendChild(commentDiv); // Añade el nuevo comentario al contenedor con el resto de comentarios
     
                document.getElementById('input-name').value = '';
                document.getElementById('input-date').value = ''; // Esta parte limpia las casillas una vez que se presiona enviar
                document.querySelector('textarea').value = '';
                document.querySelector('input[name="rating"]:checked').checked = false; // Desmarcar la calificación
            } else {
                alert("Por favor, completa todos los campos antes de enviar.");
            }
        });
    } else {
        console.error('No se encontró el ID del producto en el almacenamiento local.');
    }

        // Creamos la función que llama a los productos relacionados
        function loadRelatedProducts(relatedProducts) {
            const relatedContainer = document.getElementById('related-products-container');
            relatedContainer.innerHTML = '';

        relatedProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('related-product');

        const productImg = document.createElement('img');
            productImg.src = product.images[0];
            productImg.alt = product.name;
            productImg.classList.add('related-product-img');

        const productName = document.createElement('p');
            productName.textContent = product.name;

        // Se añadió un evento de clic para que cuando se seleccione un producto relacionado, actualize la página con el nuevo producto
        productDiv.addEventListener('click', () => {
            localStorage.setItem('selectedProductId', product.id);
            location.reload();
        });

        // Agrega la imagen y el nombre al div del producto
        productDiv.appendChild(productImg);
        productDiv.appendChild(productName);

        // Agrega el producto relacionado al contenedor
        relatedContainer.appendChild(productDiv);
    });
}

    // Realizamos la peticion al fetch que obtiene la información de los productos
    fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
        .then(response => response.json())
        .then(product => {
        
        if (product.relatedProducts && product.relatedProducts.length > 0) {
            fetchRelatedProducts(product.relatedProducts);
        }
    })
    .catch(error => console.error('Error al obtener la información del producto:', error));

    // Esta es la función que obtiene la información directa de los productos relacionados
    function fetchRelatedProducts(relatedProductIds) {
    const requests = relatedProductIds.map(relatedProduct => 
        fetch(`https://japceibal.github.io/emercado-api/products/${relatedProduct.id}.json`)
        .then(response => response.json())
    );

    Promise.all(requests)
        .then(relatedProducts => {
            loadRelatedProducts(relatedProducts);
        })
        .catch(error => console.error('Error al cargar productos relacionados:', error));
}

});
