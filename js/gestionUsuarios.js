const API_URL = 'http://localhost:3000/api';

// Esperar a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
  // Obtener referencias a los elementos del DOM
  const createUserForm = document.getElementById('createUserForm'); // Formulario para crear usuarios
  const updateUserForm = document.getElementById('updateUserForm'); // Formulario para actualizar usuarios
  const deleteUserForm = document.getElementById('deleteUserForm'); // Formulario para eliminar usuarios
  const userList = document.getElementById('userList'); // Lista donde se mostrarán los usuarios

  // Cargar usuarios al iniciar la página
  loadUsers();

  /**
   * Crear un nuevo usuario
   */
  createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que el formulario recargue la página

    // Obtener los valores de los campos del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    try {
      // Enviar una solicitud POST al backend para crear un nuevo usuario
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password_hash: password, role, phone, address }),
      });

      if (response.ok) {
        alert('Usuario creado correctamente'); // Mostrar mensaje de éxito
        createUserForm.reset(); // Limpiar el formulario
        loadUsers(); // Actualizar la lista de usuarios
      } else {
        alert('Error al crear el usuario'); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error('Error al crear usuario:', error.message); // Registrar el error en la consola
      alert('Error al crear el usuario'); // Mostrar mensaje de error al usuario
    }
  });

  /**
   * Actualizar un usuario existente
   */
  updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que el formulario recargue la página

    // Obtener los valores de los campos del formulario
    const id = document.getElementById('updateUserId').value;
    const name = document.getElementById('updateName').value;
    const email = document.getElementById('updateEmail').value;
    const password = document.getElementById('updatePassword').value;
    const role = document.getElementById('updateRole').value;
    const phone = document.getElementById('updatePhone').value;
    const address = document.getElementById('updateAddress').value;

    try {
      // Enviar una solicitud PUT al backend para actualizar el usuario
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password_hash: password, role, phone, address }),
      });

      if (response.ok) {
        alert('Usuario actualizado correctamente'); // Mostrar mensaje de éxito
        updateUserForm.reset(); // Limpiar el formulario
        loadUsers(); // Actualizar la lista de usuarios
      } else {
        alert('Error al actualizar el usuario'); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error.message); // Registrar el error en la consola
      alert('Error al actualizar el usuario'); // Mostrar mensaje de error al usuario
    }
  });

  /**
   * Eliminar un usuario existente
   */
  deleteUserForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que el formulario recargue la página

    // Obtener el ID del usuario a eliminar
    const id = document.getElementById('deleteUserId').value;

    try {
      // Enviar una solicitud DELETE al backend para eliminar el usuario
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Usuario eliminado correctamente'); // Mostrar mensaje de éxito
        deleteUserForm.reset(); // Limpiar el formulario
        loadUsers(); // Actualizar la lista de usuarios
      } else {
        alert('Error al eliminar el usuario'); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error.message); // Registrar el error en la consola
      alert('Error al eliminar el usuario'); // Mostrar mensaje de error al usuario
    }
  });

  /**
   * Función para cargar y mostrar la lista de usuarios
   */
  async function loadUsers() {
    try {
      // Realizar una solicitud GET al backend para obtener la lista de usuarios
      const response = await fetch(`${API_URL}/usuarios`);
      const users = await response.json();

      // Limpiar la lista de usuarios antes de agregar nuevos
      userList.innerHTML = '';

      // Iterar sobre los usuarios y agregarlos a la lista
      users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = `ID: ${user.id}, Nombre: ${user.name}, Email: ${user.email}, Rol: ${user.role}`;
        userList.appendChild(li);
      });
    } catch (error) {
      console.error('Error al cargar usuarios:', error.message); // Registrar el error en la consola
      alert('Error al cargar usuarios'); // Mostrar mensaje de error al usuario
    }
  }
});