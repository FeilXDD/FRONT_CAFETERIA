document.addEventListener('DOMContentLoaded', () => {
  const categoriaGrid = document.getElementById('categoria-grid');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalProductList = document.getElementById('modal-product-list');
  const closeModalButton = document.querySelector('.close');

  // Elementos del carrito
  const carritoBtn = document.getElementById('carrito-btn');
  const carritoModal = document.getElementById('carrito-modal');
  const closeCarritoButton = document.querySelector('.close-carrito');
  const carritoList = document.getElementById('carrito-list');
  const totalCarritoElement = document.getElementById('total-carrito');
  const hacerPedidoBtn = document.getElementById('hacer-pedido-btn');

  // URL del backend
  const BACKEND_URL = 'https://back-cafeteria-render.onrender.com';

  // Función para obtener las categorías del backend
  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/categorias`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const categorias = await response.json();

      // Limpiar el contenedor antes de agregar nuevas tarjetas
      categoriaGrid.innerHTML = '';

      // Crear una tarjeta para cada categoría
      categorias.forEach((categoria) => {
        const card = document.createElement('div');
        card.classList.add('card');
        const imagen = categoria.imagen || 'https://via.placeholder.com/150';
        card.innerHTML = `
          <img src="${imagen}" alt="${categoria.nombre}">
          <h2>${categoria.nombre}</h2>
          <p>${categoria.descripcion || 'Sin descripción'}</p>
          <button onclick="abrirModal(${categoria.id}, '${categoria.nombre}')">Ver Productos</button>
        `;
        categoriaGrid.appendChild(card);
      });
    } catch (error) {
      console.error(error);
      categoriaGrid.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  };

  // Llamar a la función para cargar las categorías
  fetchCategorias();

  // Función para abrir el modal
  window.abrirModal = async (categoriaId, categoriaNombre) => {
    try {
      const response = await fetch(`${BACKEND_URL}/categorias/${categoriaId}/productos`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const productos = await response.json();

      // Configurar el título del modal
      modalTitle.textContent = `Productos de ${categoriaNombre}`;

      // Limpiar el contenido anterior del modal
      modalProductList.innerHTML = '';

      // Mostrar los productos en el modal
      productos.forEach((producto) => {
        const precioNumerico = parseFloat(producto.precio);
        const card = document.createElement('div');
        card.classList.add('product-card');
        const imagen = producto.imagen || 'https://via.placeholder.com/150';
        card.innerHTML = `
          <img src="${imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p>Precio: $${precioNumerico.toFixed(2)}</p>
          <button onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${precioNumerico})">Agregar al Carrito</button>
        `;
        modalProductList.appendChild(card);
      });

      // Mostrar el modal
      modal.classList.remove('hidden');
    } catch (error) {
      console.error(error);
      modalProductList.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  };

  // Función para cerrar el modal
  closeModalButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Cerrar el modal al hacer clic fuera de él
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Función para agregar un producto al carrito
  window.agregarAlCarrito = async (id, nombre, precio) => {
    const clienteId = 'cliente-123';
    const cantidad = 1;
    try {
      // Agregar el producto al carrito en el backend
      await fetch(`${BACKEND_URL}/carrito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clienteId, productoId: id, cantidad }),
      });

      alert(`Producto "${nombre}" agregado al carrito.`);

      // Actualizar el carrito en el frontend
      actualizarCarrito();
    } catch (error) {
      console.error(error);
      alert(`Error al agregar el producto al carrito: ${error.message}`);
    }
  };

  // Función para actualizar el carrito
  const actualizarCarrito = async () => {
    const clienteId = 'cliente-123';
    try {
      // Obtener el carrito del backend
      const response = await fetch(`${BACKEND_URL}/carrito/${clienteId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const carritoBackend = await response.json();

      // Limpiar el contenido anterior del carrito
      carritoList.innerHTML = '';

      // Mostrar los productos en el carrito
      carritoBackend.forEach((item) => {
        const precioNumerico = parseFloat(item.precio);
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
          <h3>${item.nombre}</h3>
          <p>Precio: $${precioNumerico.toFixed(2)}</p>
          <p>Cantidad: ${item.cantidad}</p>
          <p>Subtotal: $${(precioNumerico * item.cantidad).toFixed(2)}</p>
        `;
        carritoList.appendChild(card);
      });

      // Calcular el total
      const total = carritoBackend.reduce((suma, item) => suma + parseFloat(item.precio) * item.cantidad, 0);
      totalCarritoElement.textContent = total.toFixed(2);
    } catch (error) {
      console.error(error);
      carritoList.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  };

  // Función para abrir el modal del carrito
  carritoBtn.addEventListener('click', () => {
    actualizarCarrito();
    carritoModal.classList.remove('hidden');
  });

  // Función para cerrar el modal del carrito
  closeCarritoButton.addEventListener('click', () => {
    carritoModal.classList.add('hidden');
  });

  // Cerrar el modal del carrito al hacer clic fuera de él
  carritoModal.addEventListener('click', (event) => {
    if (event.target === carritoModal) {
      carritoModal.classList.add('hidden');
    }
  });

  // Función para hacer un pedido
  hacerPedidoBtn.addEventListener('click', async () => {
    const clienteId = 'cliente-123';
    try {
      // Obtener el carrito del backend
      const response = await fetch(`${BACKEND_URL}/carrito/${clienteId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const carritoBackend = await response.json();

      // Validar que el carrito no esté vacío
      if (carritoBackend.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de hacer un pedido.');
        return;
      }

      // Crear el objeto del pedido
      const pedido = {
        clienteId,
        estado: 'pendiente',
        detalles: carritoBackend.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
        })),
      };

      // Enviar el pedido al backend
      const responsePedido = await fetch(`${BACKEND_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
      });

      if (!responsePedido.ok) {
        throw new Error(`Error ${responsePedido.status}: ${responsePedido.statusText}`);
      }

      const resultado = await responsePedido.json();

      // Verificar que el backend devuelva el ID del pedido
      if (!resultado.id) {
        throw new Error('El backend no devolvió el ID del pedido.');
      }

      alert(`Pedido realizado correctamente. ID del pedido: ${resultado.id}`);

      // Vaciar el carrito en el backend
      await fetch(`${BACKEND_URL}/carrito/${clienteId}`, {
        method: 'DELETE',
      });

      // Limpiar el carrito en el frontend
      actualizarCarrito();
    } catch (error) {
      console.error(error);
      alert(`Error al realizar el pedido: ${error.message}`);
    }
  });
});