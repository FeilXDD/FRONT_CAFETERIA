document.addEventListener('DOMContentLoaded', () => {
    const categoryList = document.getElementById('categoryList');
    const productModal = document.getElementById('productModal');
    const cartModal = document.getElementById('cartModal');
    const openCartButton = document.getElementById('openCartButton');
    const placeOrderButton = document.getElementById('placeOrderButton');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    let cart = [];

    // Cargar categorías
    async function loadCategories() {
        try {
            const response = await fetch('http://localhost:3000/api/categorias');
            const categories = await response.json();

            if (!Array.isArray(categories)) {
                console.error('Respuesta inesperada del servidor:', categories);
                alert('Error al cargar categorías');
                return;
            }

            categoryList.innerHTML = '';
            categories.forEach((category) => {
                const li = document.createElement('li');
                li.innerHTML = `
            <img src="${category.url_img}" alt="${category.nombre}" style="width: 50px; height: 50px;">
            <strong>${category.nombre}</strong>: ${category.descripcion}
            <button data-id="${category.id}">Ver productos</button>
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

    // Mostrar productos en una ventana emergente
    async function showProducts(categoryId) {
        try {
            const response = await fetch(`http://localhost:3000/api/menu?categoria_id=${categoryId}`);
            const products = await response.json();

            if (!Array.isArray(products)) {
                console.error('Respuesta inesperada del servidor:', products);
                alert('Error al cargar productos');
                return;
            }

            const productCards = document.getElementById('productCards');
            productCards.innerHTML = '';

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

            productModal.style.display = 'block';
        } catch (error) {
            console.error('Error al cargar productos:', error.message);
            alert('Error al cargar productos');
        }
    }

    // Agregar producto al carrito
    function addToCart(product) {
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }

    // Actualizar el carrito
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;

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

            total += item.price * item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
    }

    // Quitar producto del carrito
    function removeFromCart(productId) {
        cart = cart.filter((item) => item.id !== productId);
        updateCart();
    }

    // Abrir ventana emergente del carrito
    openCartButton.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    // Cerrar ventanas emergentes
    document.querySelectorAll('.close').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            productModal.style.display = 'none';
            cartModal.style.display = 'none';
        });
    });

    // Ordenar productos del carrito
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

            // Enviar el pedido al backend
            const response = await fetch('http://localhost:3000/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, total, status, items }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('¡Pedido realizado!');
                cart = [];
                updateCart();
            } else {
                alert(`Error al realizar el pedido: ${data.error}`);
            }
        } catch (error) {
            console.error('Error al realizar el pedido:', error.message);
            alert('Error al realizar el pedido');
        }
    });
    // Cargar categorías al iniciar
    loadCategories();
});