const API_URL = 'http://localhost:3000/api';
// Esperar a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los elementos del DOM
    const createCategoryForm = document.getElementById('createCategoryForm'); // Formulario para crear categorías
    const createProductForm = document.getElementById('createProductForm'); // Formulario para crear productos
    const categoryList = document.getElementById('categoryList'); // Lista donde se mostrarán las categorías
    const productList = document.getElementById('productList'); // Lista donde se mostrarán los productos
    const productCategorySelect = document.getElementById('productCategory'); // Selector de categorías para productos

    // Cargar categorías y productos al iniciar la página
    loadCategories();
    loadProducts();

    /**
     * Crear una nueva categoría
     */
    createCategoryForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar que el formulario recargue la página

        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('categoryName').value;
        const descripcion = document.getElementById('categoryDescription').value;
        const url_img = document.getElementById('categoryImage').value;

        try {
            // Enviar una solicitud POST al backend para crear una nueva categoría
            const response = await fetch(`${API_URL}/categorias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, descripcion, url_img }),
            });

            if (response.ok) {
                alert('Categoría creada correctamente'); // Mostrar mensaje de éxito
                createCategoryForm.reset(); // Limpiar el formulario
                loadCategories(); // Actualizar la lista de categorías
            } else {
                alert('Error al crear la categoría'); // Mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error al crear categoría:', error.message); // Registrar el error en la consola
            alert('Error al crear la categoría'); // Mostrar mensaje de error al usuario
        }
    });

    /**
     * Crear un nuevo producto
     */
    createProductForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar que el formulario recargue la página

        // Obtener los valores de los campos del formulario
        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const categoria_id = document.getElementById('productCategory').value;
        const image_url = document.getElementById('productImage').value;
        const ingredients = JSON.parse(document.getElementById('productIngredients').value || '[]');

        try {
            // Enviar una solicitud POST al backend para crear un nuevo producto
            const response = await fetch(`${API_URL}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, price, categoria_id, image_url, ingredients, available: true }),
            });

            if (response.ok) {
                alert('Producto creado correctamente'); // Mostrar mensaje de éxito
                createProductForm.reset(); // Limpiar el formulario
                loadProducts(); // Actualizar la lista de productos
            } else {
                alert('Error al crear el producto'); // Mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error al crear producto:', error.message); // Registrar el error en la consola
            alert('Error al crear el producto'); // Mostrar mensaje de error al usuario
        }
    });

    /**
     * Función para cargar categorías
     */
    async function loadCategories() {
        try {
            // Realizar una solicitud GET al backend para obtener la lista de categorías
            const response = await fetch(`${API_URL}/categorias`);
            const categories = await response.json();

            // Limpiar la lista de categorías antes de agregar nuevas
            categoryList.innerHTML = '';
            productCategorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';

            // Iterar sobre las categorías y agregarlas a la lista y al selector
            categories.forEach((category) => {
                const li = document.createElement('li');
                li.textContent = `ID: ${category.id}, Nombre: ${category.nombre}, Descripción: ${category.descripcion}`;
                categoryList.appendChild(li);

                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.nombre;
                productCategorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar categorías:', error.message); // Registrar el error en la consola
            alert('Error al cargar categorías'); // Mostrar mensaje de error al usuario
        }
    }

    /**
     * Función para cargar productos
     */
    async function loadProducts() {
        try {
            // Realizar una solicitud GET al backend para obtener la lista de productos
            const response = await fetch(`${API_URL}/menu`);
            const products = await response.json();

            // Limpiar la lista de productos antes de agregar nuevos
            productList.innerHTML = '';

            // Iterar sobre los productos y agregarlos a la lista
            products.forEach((product) => {
                const li = document.createElement('li');
                li.textContent = `ID: ${product.id}, Nombre: ${product.name}, Precio: $${product.price}, Categoría: ${product.categoria_id}`;
                productList.appendChild(li);
            });
        } catch (error) {
            console.error('Error al cargar productos:', error.message); // Registrar el error en la consola
            alert('Error al cargar productos'); // Mostrar mensaje de error al usuario
        }
    }
});