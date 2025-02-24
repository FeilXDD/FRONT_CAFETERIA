const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const pedidoList = document.getElementById('pedidoList');

    // Cargar pedidos al iniciar
    loadPedidos();

    /**
     * Función para cargar pedidos desde la API
     */
    async function loadPedidos() {
        try {
            const response = await fetch(`${API_URL}/pedidos`);
            const pedidos = await response.json();

            if (!Array.isArray(pedidos)) {
                console.error('Respuesta inesperada del servidor:', pedidos);
                pedidoList.innerHTML = '<p>Error al cargar pedidos.</p>';
                return;
            }

            pedidoList.innerHTML = '';

            pedidos.forEach((pedido) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="content">
                        <p><strong>ID:</strong> ${pedido.id}</p>
                        <p><strong>Total:</strong> $${pedido.total}</p>
                        <p><strong>Estado:</strong> ${pedido.status}</p>
                        <p><strong>Fecha:</strong> ${new Date(pedido.date).toLocaleString()}</p>
                    </div>
                    <button data-id="${pedido.id}" ${pedido.status === 'Completado' ? 'disabled' : ''}>
                        ${pedido.status === 'Completado' ? 'Completado' : 'Marcar como Completado'}
                    </button>
                `;
                pedidoList.appendChild(card);

                // Agregar evento al botón "Marcar como Completado"
                const button = card.querySelector('button');
                button.addEventListener('click', () => markAsCompleted(pedido.id));
            });
        } catch (error) {
            console.error('Error al cargar pedidos:', error.message);
            pedidoList.innerHTML = '<p>Error al cargar pedidos.</p>';
        }
    }

    /**
     * Función para marcar un pedido como completado
     * @param {number} pedidoId - ID del pedido
     */
    async function markAsCompleted(pedidoId) {
        try {
            const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Completado' }),
            });

            if (response.ok) {
                alert('Pedido marcado como completado');
                loadPedidos(); // Actualizar la lista de pedidos
            } else {
                const data = await response.json();
                alert(`Error al actualizar el pedido: ${data.error}`);
            }
        } catch (error) {
            console.error('Error al actualizar el pedido:', error.message);
            alert('Error al actualizar el pedido');
        }
    }
});