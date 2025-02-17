document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://localhost:3000';
  
    const categoriaForm = document.getElementById('categoriaForm');
    const categoriasList = document.getElementById('categoriasList');
    const productoForm = document.getElementById('productoForm');
    const categoriaProducto = document.getElementById('categoriaProducto');
    const productosList = document.getElementById('productosList');
  
    let categorias = [];
    let productos = [];
  
    // Cargar Categorías
    async function cargarCategorias() {
      try {
        const response = await fetch(`${BASE_URL}/categorias`);
        categorias = await response.json();
        renderizarCategorias();
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    }
  
    // Renderizar Categorías
    function renderizarCategorias() {
      categoriasList.innerHTML = '';
      categorias.forEach(categoria => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${categoria.nombre} - ${categoria.descripcion}
          <div>
            <button class="edit" onclick="editarCategoria(${categoria.id}, '${categoria.nombre}', '${categoria.descripcion}')">Editar</button>
            <button class="delete" onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
          </div>
        `;
        categoriasList.appendChild(li);
      });
      actualizarSelectCategorias();
    }
  
    // Guardar/Actualizar Categoría
    categoriaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('categoriaId').value;
      const nombre = document.getElementById('nombreCategoria').value;
      const descripcion = document.getElementById('descripcionCategoria').value;
  
      const method = id ? 'PUT' : 'POST';
      const url = id ? `${BASE_URL}/categorias/${id}` : `${BASE_URL}/categorias`;
  
      try {
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, descripcion }),
        });
        cargarCategorias();
        categoriaForm.reset();
      } catch (error) {
        console.error('Error al guardar/actualizar categoría:', error);
      }
    });
  
    // Eliminar Categoría
    window.eliminarCategoria = async (id) => {
      if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
  
      try {
        await fetch(`${BASE_URL}/categorias/${id}`, { method: 'DELETE' });
        cargarCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    };
  
    // Editar Categoría
    window.editarCategoria = (id, nombre, descripcion) => {
      document.getElementById('categoriaId').value = id;
      document.getElementById('nombreCategoria').value = nombre;
      document.getElementById('descripcionCategoria').value = descripcion;
    };
  
    // Actualizar Select de Categorías
    function actualizarSelectCategorias() {
      categoriaProducto.innerHTML = '';
      categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombre;
        categoriaProducto.appendChild(option);
      });
    }
  
    // Cargar Productos
    async function cargarProductos() {
      try {
        const response = await fetch(`${BASE_URL}/productos`);
        productos = await response.json();
        renderizarProductos();
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    }
    
    
    // Renderizar Productos
    function renderizarProductos() {
      productosList.innerHTML = '';
      productos.forEach(producto => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${producto.nombre} - $${producto.precio}
          <div>
            <button class="edit" onclick="editarProducto(${producto.id}, '${producto.nombre}', '${producto.descripcion}', ${producto.categoriaId}, ${producto.precio})">Editar</button>
            <button class="delete" onclick="eliminarProducto(${producto.id})">Eliminar</button>
          </div>
        `;
        productosList.appendChild(li);
      });
    }
  
    // Guardar/Actualizar Producto
    productoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('productoId').value;
      const nombre = document.getElementById('nombreProducto').value;
      const descripcion = document.getElementById('descripcionProducto').value;
      const categoriaId = categoriaProducto.value;
      const precio = document.getElementById('precioProducto').value;
  
      const method = id ? 'PUT' : 'POST';
      const url = id ? `${BASE_URL}/productos/${id}` : `${BASE_URL}/productos`;
  
      try {
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, descripcion, precio, categoriaId }),
        });
        cargarProductos();
        productoForm.reset();
      } catch (error) {
        console.error('Error al guardar/actualizar producto:', error);
      }
    });
  
    // Eliminar Producto
    window.eliminarProducto = async (id) => {
      if (!confirm('¿Estás seguro de eliminar este producto?')) return;
  
      try {
        await fetch(`${BASE_URL}/productos/${id}`, { method: 'DELETE' });
        cargarProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    };
  
    // Editar Producto
    window.editarProducto = (id, nombre, descripcion, categoriaId, precio) => {
      document.getElementById('productoId').value = id;
      document.getElementById('nombreProducto').value = nombre;
      document.getElementById('descripcionProducto').value = descripcion;
      categoriaProducto.value = categoriaId;
      document.getElementById('precioProducto').value = precio;
    };
  
    // Inicializar
    cargarCategorias();
    cargarProductos();
  });