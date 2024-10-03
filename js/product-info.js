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
                document.getElementById('product-category').textContent = product.category || 'Categoría no disponible';
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
                fetch(`https://japceibal.github.io/emercado-api/products_comments/` + productId +`.json`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud a la API`)
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const commentsContainer = document.getElementById(`comments-container`);
                    commentsContainer.innerHTML = ` ` // Limpiar contenido previo

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
                        rating.textContent = `Calificación: ${comment.score}`;

                        let stars = ` `;
                        for (let i = 1; i <= 5; i++) {
                            stars += `<i class="fas fa-star ${i <= comment.score ? `text-warning` : `text-muted`}"></i>`
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
                    console.error(`Error al cargar los comentarios:`. error)
                    const commentsContainer = document.getElementById(`comments-container`);
                    commentsContainer.innerHTML = `<p>Error al cargar los comentarios</p>`;
                });
                
            }

            loadComments();
        
            // Parte de enviar y escribir comentarios
        const sendButton = document.querySelector('.btn-primary'); // Creamos una constante para el boton de enviar
        sendButton.addEventListener('click', () => { // Le añadimos funcionalidad
            const nameInput = document.getElementById('input-name').value; 
            const dateInput = document.getElementById('input-date').value;          // Creamos una constante para obtener //
            const opinionInput = document.querySelector('textarea').value;          // Cada una de las casillas que llenamos //                 
            const ratingInput = document.querySelector('input[name="rating"]:checked'); 

            if (nameInput && dateInput && opinionInput && ratingInput) { // verificamos si todos los campos estan completos
                const score = ratingInput.value; // hay que guardarlo en una constante porque sino se rompe 

                const newComment = { // creamos un objeto con la informacion correspondiente del
                    user: nameInput,
                    dateTime: dateInput,
                    description: opinionInput,
                    score: score 
                };

                const commentDiv = document.createElement('div'); // crea un nuevo div donde se mostrara el comentario
                commentDiv.classList.add('comment');
                commentDiv.innerHTML = `
                    <h5>Comentario de: ${newComment.user}</h5>     
                    <p>Calificación: ${newComment.score}</p>
                    <p>Comentario: ${newComment.description}</p>
                    <p>Fecha: ${newComment.dateTime}</p>
                `;

                const commentsContainer = document.getElementById('comments-container');
                commentsContainer.appendChild(commentDiv); // Añade el nuevo comentario al contenedor con el resto de comentarios
     
                document.getElementById('input-name').value = '';
                document.getElementById('input-date').value = '';       // Esta parte limpia las casillas una vez que se presiona enviar
                document.querySelector('textarea').value = '';
                document.querySelector('input[name="rating"]:checked').checked = false; // Desmarcar la calificación
            } else {
                alert("Por favor, completa todos los campos antes de enviar.");
            }
        });
    } else {
        console.error('No se encontró el ID del producto en el almacenamiento local.');
    }
});


