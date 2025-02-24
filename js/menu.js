// Constante para la URL principal de la API
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const categoryList = document.getElementById('categoryList');
    const productModal = document.getElementById('productModal');
    const cartModal = document.getElementById('cartModal');
    const openCartButton = document.getElementById('openCartButton');
    const placeOrderButton = document.getElementById('placeOrderButton');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Carrito de compras (array para almacenar productos)
    let cart = [];

    /**
 * Cargar categorías desde la API
 */
    async function loadCategories() {
        try {
            // Realizar solicitud GET a la API para obtener las categorías
            const response = await fetch(`${API_URL}/categorias`);
            const categories = await response.json();

            // Validar si la respuesta es un array
            if (!Array.isArray(categories)) {
                console.error('Respuesta inesperada del servidor:', categories);
                alert('Error al cargar categorías');
                return;
            }

            // Limpiar la lista de categorías antes de agregar nuevas
            categoryList.innerHTML = '';

            // Iterar sobre las categorías y crear elementos HTML
            categories.forEach((category) => {
                const li = document.createElement('li');
                li.innerHTML = `
                <img src="${category.url_img}" alt="${category.nombre}">
                <div class="content">
                    <strong>${category.nombre}</strong>
                    <p>${category.descripcion}</p>
                    <button data-id="${category.id}">Ver productos</button>
                </div>
            `;
                categoryList.appendChild(li);

                // Agregar evento al botón "Ver productos"
                li.querySelector('button').addEventListener('click', () => showProducts(category.id));
            });
        } catch (error) {
            console.error('Error al cargar categorías:', error.message);
            alert('Error al cargar categorías');
        }
    }

    /**
     * Mostrar productos de una categoría específica en una ventana modal
     * @param {number} categoryId - ID de la categoría seleccionada
     */
    async function showProducts(categoryId) {
        try {
            // Realizar solicitud GET a la API para obtener los productos de la categoría
            const response = await fetch(`${API_URL}/menu?categoria_id=${categoryId}`);
            const products = await response.json();

            // Validar si la respuesta es un array
            if (!Array.isArray(products)) {
                console.error('Respuesta inesperada del servidor:', products);
                alert('Error al cargar productos');
                return;
            }

            // Limpiar el contenedor de productos antes de agregar nuevos
            const productCards = document.getElementById('productCards');
            productCards.innerHTML = '';

            // Iterar sobre los productos y crear tarjetas HTML
            products.forEach((product) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${product.image_url}" alt="${product.name}">
                    <div>
                        <h3>${product.name}</h3>
                        <p>Precio: $${product.price}</p>
                        <button data-id="${product.id}">Agregar al carrito</button>
                    </div>
                `;
                productCards.appendChild(card);

                // Agregar evento al botón "Agregar al carrito"
                card.querySelector('button').addEventListener('click', () => addToCart(product));
            });

            // Mostrar la ventana modal de productos
            productModal.style.display = 'block';
        } catch (error) {
            console.error('Error al cargar productos:', error.message);
            alert('Error al cargar productos');
        }
    }

    /**
     * Agregar un producto al carrito
     * @param {object} product - Producto a agregar
     */
    function addToCart(product) {
        // Buscar si el producto ya está en el carrito
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            // Si existe, incrementar la cantidad
            existingItem.quantity += 1;
        } else {
            // Si no existe, agregarlo al carrito con cantidad inicial 1
            cart.push({ ...product, quantity: 1 });
        }

        // Actualizar la interfaz del carrito
        updateCart();
    }

    /**
     * Actualizar la interfaz del carrito
     */
    function updateCart() {
        // Limpiar el contenedor de elementos del carrito
        cartItems.innerHTML = '';
        let total = 0;

        // Iterar sobre los productos en el carrito y crear tarjetas HTML
        cart.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>Precio: $${item.price} x ${item.quantity}</p>
                    <button data-id="${item.id}">Quitar</button>
                </div>
            `;
            cartItems.appendChild(card);

            // Agregar evento al botón "Quitar"
            card.querySelector('button').addEventListener('click', () => removeFromCart(item.id));

            // Calcular el total acumulado
            total += item.price * item.quantity;
        });

        // Actualizar el total en la interfaz
        cartTotal.textContent = total.toFixed(2);
    }

    /**
     * Quitar un producto del carrito
     * @param {number} productId - ID del producto a quitar
     */
    function removeFromCart(productId) {
        // Filtrar el carrito para eliminar el producto con el ID especificado
        cart = cart.filter((item) => item.id !== productId);

        // Actualizar la interfaz del carrito
        updateCart();
    }

    /**
     * Abrir la ventana modal del carrito
     */
    openCartButton.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    /**
     * Cerrar ventanas modales
     */
    document.querySelectorAll('.close').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            productModal.style.display = 'none';
            cartModal.style.display = 'none';
        });
    });

    /**
     * Realizar un pedido enviando los datos del carrito al backend
     */
    placeOrderButton.addEventListener('click', async () => {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        try {
            // Preparar los datos del pedido
            const userId = 1; // ID del usuario actual (puedes obtenerlo del login)
            const total = parseFloat(cartTotal.textContent);
            const status = 'En preparación';
            const items = cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                customizations: {}, // Puedes agregar personalizaciones si es necesario
            }));

            // Enviar el pedido al backend mediante una solicitud POST
            const response = await fetch(`${API_URL}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, total, status, items }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('¡Pedido realizado!');
                cart = []; // Vaciar el carrito
                updateCart(); // Actualizar la interfaz
            } else {
                alert(`Error al realizar el pedido: ${data.error}`);
            }
        } catch (error) {
            console.error('Error al realizar el pedido:', error.message);
            alert('Error al realizar el pedido');
        }
    });

    // Cargar categorías al iniciar la aplicación
    loadCategories();
});