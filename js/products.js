let productsData = []; // Variable global para almacenar los productos
let originalProductsData = []; // Variable global para almacenar los productos originales

function loadProducts() {
    let categoriaID = localStorage.getItem("catID");

    fetch('https://japceibal.github.io/emercado-api/cats_products/' + categoriaID + '.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la solicitud a la API: ") /*+ response.statusText);*/
            };
            return response.json();
        })
        .then(data => {
            //console.log("Datos de productos:", data);
            console.log(data);
            productsData = data.products;// Guardar productos en la variable global
            originalProductsData = [...productsData];// Guardar una copia de los productos originales
            displayProducts(productsData);// Mostrar los productos cargados
            initializeSlider();// Inicializar el slider después de que se carguen los productos
            initializeSearch();
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            document.getElementById('product-list').innerHTML = '<p>Error al cargar los productos.</p>';
        });
}

function displayProducts(products) {
    let productList = document.getElementById('product-list');
    let htmlContentToAppend = '';

    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let price = (typeof product.cost === 'number' && !isNaN(product.cost)) ? product.cost.toLocaleString() : 'N/A';
        let soldCount = (typeof product.soldCount === 'number') ? product.soldCount : 'N/A';
        let currency = product.currency ? product.currency : 'UYU'; // Usar 'UYU' como valor por defecto si currency no está definido
        htmlContentToAppend += `
            <div class="card mb-4 product" data-id="${product.id}" data-price="${product.cost}">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">Precio: ${currency} ${price}</p>
                    <p class="card-text">Cantidad Vendidos: ${soldCount}</p>
                </div>
            </div>
        `;
    }
    productList.innerHTML = htmlContentToAppend;

    // Asignar el evento después de que los productos se hayan cargado
    const productsElements = document.querySelectorAll('.product');
    productsElements.forEach(product => {
        product.addEventListener('click', function() {
            // Obtén el ID del producto
            const productId = this.getAttribute('data-id');
            // Guarda el ID en el almacenamiento local
            localStorage.setItem('selectedProductId', productId);
            // Redirige a product-info.html
            window.location.href = 'product-info.html';
        });
    });
}

function initializeSlider() {
    $("#price-slider").slider({
        range: true,
        min: 0,
        max: 4000000,
        values: [0, 4000000],
        slide: function(event, ui) {
            // Actualiza los textos de los precios
            $("#min-price").text(`$USD ${ui.values[0].toLocaleString()}`);
            $("#max-price").text(`$USD ${ui.values[1].toLocaleString()}`);
            // Actualiza los valores de los campos de entrada
            $("#min-price-input").val(ui.values[0]);
            $("#max-price-input").val(ui.values[1]);
            // Filtra los productos en función del rango del slider
            filterProducts(ui.values[0], ui.values[1]);
        }
    });

    // Inicializa los valores de los campos de entrada con los valores actuales del slider
    $("#min-price-input").val($("#price-slider").slider("values", 0));
    $("#max-price-input").val($("#price-slider").slider("values", 1));

    $("#min-price").text(`$USD ${$("#price-slider").slider("values", 0).toLocaleString()}`);
    $("#max-price").text(`$USD ${$("#price-slider").slider("values", 1).toLocaleString()}`);

    // Filtrar productos al cargar la página
    filterProducts($("#price-slider").slider("values", 0), $("#price-slider").slider("values", 1));
}

function filterProducts(minPrice, maxPrice) {
    // Filtrar los productos basados en el rango de precios
    let filteredProducts = productsData.filter(product => {
        let price = parseFloat(product.cost);
        return price >= minPrice && price <= maxPrice;
    });
    // Mostrar los productos filtrados
    displayProducts(filteredProducts);
}

function initializeSearch() {
    // Asignamos el evento de filtro al campo de búsqueda
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        let query = this.value.toLowerCase(); //Evitamos que la búsqueda sea sensible a mayúsculas/minúsculas. 
        let filteredProducts = productsData.filter(product => {
            let name = product.name.toLowerCase();
            let description = product.description.toLowerCase();
            return name.includes(query) || description.includes(query);//Devuelve true si la consulta de búsqueda está incluida en el nombre o en la descripción del producto.
        });
        displayProducts(filteredProducts);
    });
}

function sortProducts(sortBy) {
    if (sortBy === 'price-asc') {
        productsData.sort((a, b) => a.cost - b.cost);
    } else if (sortBy === 'price-desc') {
        productsData.sort((a, b) => b.cost - a.cost);
    } else if (sortBy === 'relevance-desc') {
        productsData.sort((a, b) => b.soldCount - a.soldCount);
    }
    displayProducts(productsData);// Actualizar la lista mostrada
}

function restoreOriginalOrder() {
    productsData = [...originalProductsData];// Restaurar la lista original
    displayProducts(productsData);// Mostrar productos en el orden original
}

// Configuración de los botones de ordenación
document.getElementById('sort-price-asc').addEventListener('click', function() {
    sortProducts('price-asc');
});

document.getElementById('sort-price-desc').addEventListener('click', function() {
    sortProducts('price-desc');
});

document.getElementById('sort-relevance-desc').addEventListener('click', function() {
    sortProducts('relevance-desc');
});

// Configuración del botón para restaurar el orden original
document.getElementById('restore-original-order').addEventListener('click', function() {
    restoreOriginalOrder();
});

// Manejar cambios manuales con clic
document.getElementById('apply-price-range').addEventListener('click', function() {
    applyPriceRange();
});

 // Manejar cambios manuales con la tecla Enter
document.getElementById('min-price-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        applyPriceRange();
        this.blur(); // Desenfocar el campo de texto
    }
});
document.getElementById('max-price-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        applyPriceRange();
        this.blur(); // Desenfocar el campo de texto
    }
});

function applyPriceRange() {
    let minPrice = parseFloat(document.getElementById('min-price-input').value) || 0;
    let maxPrice = parseFloat(document.getElementById('max-price-input').value) || 4000000;

    $("#price-slider").slider("values", [minPrice, maxPrice]);
    $("#min-price").text(`$USD ${minPrice.toLocaleString()}`);
    $("#max-price").text(`$USD ${maxPrice.toLocaleString()}`);
    filterProducts(minPrice, maxPrice);
}

// Limpiar campos de texto
const cajasDeTexto = document.querySelectorAll('#min-price-input, #max-price-input');// Selecciona las cajas de texto
function borrarContenido(event) {// Función que borra el contenido de la caja de texto
    event.target.value = '';
}
// Añade el evento "focus" a todos los elementos seleccionados
cajasDeTexto.forEach(caja => {
    caja.addEventListener('focus', borrarContenido);
});

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});
