document.addEventListener('DOMContentLoaded', () => {
    const createCategoryForm = document.getElementById('createCategoryForm');
    const createProductForm = document.getElementById('createProductForm');
    const categoryList = document.getElementById('categoryList');
    const productList = document.getElementById('productList');
    const productCategorySelect = document.getElementById('productCategory');

    // Cargar categorías y productos al iniciar
    loadCategories();
    loadProducts();

    // Crear una nueva categoría
    createCategoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('categoryName').value;
        const descripcion = document.getElementById('categoryDescription').value;
        const url_img = document.getElementById('categoryImage').value;

        try {
            const response = await fetch('http://localhost:3000/api/categorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, descripcion, url_img }),
            });

            if (response.ok) {
                alert('Categoría creada correctamente');
                createCategoryForm.reset();
                loadCategories();
            } else {
                alert('Error al crear la categoría');
            }
        } catch (error) {
            console.error('Error al crear categoría:', error.message);
            alert('Error al crear la categoría');
        }
    });

    // Crear un nuevo producto
    createProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const categoria_id = document.getElementById('productCategory').value;
        const image_url = document.getElementById('productImage').value;
        const ingredients = JSON.parse(document.getElementById('productIngredients').value || '[]');

        try {
            const response = await fetch('http://localhost:3000/api/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, price, categoria_id, image_url, ingredients, available: true }),
            });

            if (response.ok) {
                alert('Producto creado correctamente');
                createProductForm.reset();
                loadProducts();
            } else {
                alert('Error al crear el producto');
            }
        } catch (error) {
            console.error('Error al crear producto:', error.message);
            alert('Error al crear el producto');
        }
    });

    // Función para cargar categorías
    async function loadCategories() {
        try {
            const response = await fetch('http://localhost:3000/api/categorias');
            const categories = await response.json();

            categoryList.innerHTML = '';
            productCategorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';

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
            console.error('Error al cargar categorías:', error.message);
            alert('Error al cargar categorías');
        }
    }

    // Función para cargar productos
    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/menu');
            const products = await response.json();

            productList.innerHTML = '';
            products.forEach((product) => {
                const li = document.createElement('li');
                li.textContent = `ID: ${product.id}, Nombre: ${product.name}, Precio: $${product.price}, Categoría: ${product.categoria_id}`;
                productList.appendChild(li);
            });
        } catch (error) {
            console.error('Error al cargar productos:', error.message);
            alert('Error al cargar productos');
        }
    }
});