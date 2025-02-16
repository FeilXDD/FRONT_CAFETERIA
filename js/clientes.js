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

  let carrito = []; // Almacena los productos agregados al carrito

  // Función para obtener las categorías del backend
  const fetchCategorias = async () => {
    try {
      const response = await fetch('https://back-cafeteria-render.onrender.com/categorias'); // Cambia la URL si es necesario
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

        const imagen = categoria.imagen || './images/default.jpg'; // Usa una imagen local

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
      const response = await fetch(`https://back-cafeteria-render.onrender.com/categorias/${categoriaId}/productos`);
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
        const precioNumerico = parseFloat(producto.precio); // Convierte el precio a número

        const card = document.createElement('div');
        card.classList.add('product-card');

        const imagen = producto.imagen || './images/default.jpg'; // Usa una imagen local

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
  window.agregarAlCarrito = (id, nombre, precio) => {
    const productoExistente = carrito.find((item) => item.id === id);

    if (productoExistente) {
      productoExistente.cantidad += 1; // Incrementar la cantidad si ya está en el carrito
    } else {
      carrito.push({ id, nombre, precio, cantidad: 1 }); // Agregar el producto al carrito
    }

    actualizarCarrito(); // Actualizar el resumen del carrito
  };

  // Función para actualizar el carrito
  const actualizarCarrito = () => {
    // Limpiar el contenido anterior del carrito
    carritoList.innerHTML = '';

    // Mostrar los productos en el carrito
    carrito.forEach((item) => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      card.innerHTML = `
        <h3>${item.nombre}</h3>
        <p>Precio: $${item.precio.toFixed(2)}</p>
        <p>Cantidad: ${item.cantidad}</p>
        <p>Subtotal: $${(item.precio * item.cantidad).toFixed(2)}</p>
      `;

      carritoList.appendChild(card);
    });

    // Calcular el total
    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    totalCarritoElement.textContent = total.toFixed(2); // Mostrar el total con dos decimales
  };

  // Función para abrir el modal del carrito
  carritoBtn.addEventListener('click', () => {
    actualizarCarrito(); // Actualizar el contenido del carrito
    carritoModal.classList.remove('hidden'); // Mostrar el modal del carrito
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
});