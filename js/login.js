const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    /**
     * Manejar el inicio de sesión
     */
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Realizar solicitud POST al backend para iniciar sesión
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirigir según el rol del usuario
                if (data.user.role === 'admin') {
                    window.location.href = 'gestionUsuarios.html'; // Acceso a administradores
                } else if (data.user.role === 'empleado') {
                    window.location.href = 'gestionCategoriasProductos.html'; // Acceso a empleados
                } else {
                    errorMessage.textContent = 'Rol no autorizado';
                    errorMessage.style.display = 'block';
                }
            } else {
                errorMessage.textContent = data.error || 'Error al iniciar sesión';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error.message);
            errorMessage.textContent = 'Error interno del servidor';
            errorMessage.style.display = 'block';
        }
    });
});