document.addEventListener('DOMContentLoaded', () => {
  const createUserForm = document.getElementById('createUserForm');
  const updateUserForm = document.getElementById('updateUserForm');
  const deleteUserForm = document.getElementById('deleteUserForm');
  const userList = document.getElementById('userList');

  // Cargar usuarios al iniciar
  loadUsers();

  // Crear un nuevo usuario
  createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    try {
      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password_hash: password, role, phone, address }),
      });

      if (response.ok) {
        alert('Usuario creado correctamente');
        createUserForm.reset();
        loadUsers();
      } else {
        alert('Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error al crear usuario:', error.message);
      alert('Error al crear el usuario');
    }
  });

  // Actualizar un usuario
  updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('updateUserId').value;
    const name = document.getElementById('updateName').value;
    const email = document.getElementById('updateEmail').value;
    const password = document.getElementById('updatePassword').value;
    const role = document.getElementById('updateRole').value;
    const phone = document.getElementById('updatePhone').value;
    const address = document.getElementById('updateAddress').value;

    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password_hash: password, role, phone, address }),
      });

      if (response.ok) {
        alert('Usuario actualizado correctamente');
        updateUserForm.reset();
        loadUsers();
      } else {
        alert('Error al actualizar el usuario');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error.message);
      alert('Error al actualizar el usuario');
    }
  });

  // Eliminar un usuario
  deleteUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('deleteUserId').value;

    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Usuario eliminado correctamente');
        deleteUserForm.reset();
        loadUsers();
      } else {
        alert('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error.message);
      alert('Error al eliminar el usuario');
    }
  });

  // Función para cargar usuarios
  async function loadUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios');
      const users = await response.json();

      userList.innerHTML = '';
      users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = `ID: ${user.id}, Nombre: ${user.name}, Email: ${user.email}, Rol: ${user.role}`;
        userList.appendChild(li);
      });
    } catch (error) {
      console.error('Error al cargar usuarios:', error.message);
      alert('Error al cargar usuarios');
    }
  }
});