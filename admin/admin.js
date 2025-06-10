// --- Login ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('usuario').value.trim();
        const password = document.getElementById('contrasena').value.trim();
        const msgDiv = document.getElementById('login-msg');

        fetch('http://localhost:3000/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = "adminPanel.html";
            } else {
                msgDiv.textContent = data.error || "Usuario o contraseña incorrectos.";
            }
        })
        .catch(() => {
            msgDiv.textContent = "Error de conexión con el servidor.";
        });
    });
}

// --- Panel de administración ---
// Cancelar por tormenta
const buscarForm = document.getElementById('buscar-form');
if (buscarForm) {
    buscarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('reserva-id').value.trim();
        const panelMsg = document.getElementById('admin-panel-msg');

        fetch(`http://localhost:3000/rentals/storm/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.error) {
                panelMsg.innerHTML = `<p class="text-red-500 text-center">${data.error}</p>`;
            } else {
                panelMsg.innerHTML = `<p class="text-green-600 text-center">Reserva cancelada por tormenta correctamente.</p>`;
            }
        })
        .catch(() => {
            panelMsg.innerHTML = `<p class="text-red-500">Error de conexión con el servidor.</p>`;
        });
    });
}

const btnLiberar = document.getElementById('btn-liberar');
if (btnLiberar) {
    btnLiberar.addEventListener('click', function() {
        const panelMsg = document.getElementById('admin-panel-msg');;
        panelMsg.textContent = "Procesando...";
        fetch('http://localhost:3000/rentals/release-unpaid/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Respuesta del servidor:', data);
            if (data.error) {
                panelMsg.innerHTML = `<p class="text-red-500">${data.error}</p>`;
            } else {
                panelMsg.innerHTML = `<p class="text-green-600 text-center">${data.message}.</p>`;
            }
        })
        .catch(() => {
            panelMsg.innerHTML = `<p class="text-red-500">Error de conexión con el servidor.</p>`;
        });
    });
}

// Cobrar reservas
const btnCobrar = document.getElementById('cobrar');
if (buscarForm) {
    buscarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('reserva-id').value.trim();
        const panelMsg = document.getElementById('admin-panel-msg');

        fetch(`http://localhost:3000/rentals/unpaid/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.error) {
                panelMsg.innerHTML = `<p class="text-red-500 text-center">${data.error}</p>`;
            } else {
                panelMsg.innerHTML = `<p class="text-green-600 text-center">Reserva cancelada por tormenta correctamente.</p>`;
            }
        })
        .catch(() => {
            panelMsg.innerHTML = `<p class="text-red-500">Error de conexión con el servidor.</p>`;
        });
    });
}

const btnListarDia = document.getElementById('btn-listar-dia');
if (btnListarDia) {
    btnListarDia.addEventListener('click', function() {
        const tablaDiv = document.getElementById('tabla-reservas-dia');
        const tbody = document.getElementById('tbody-reservas-dia');
        tablaDiv.classList.remove('hidden');
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Cargando...</td></tr>`;

        fetch('http://localhost:3000/rentals/today')
            .then(res => res.json())
            .then(data => {
                console.log('Reservas del día:', data);
                if (!Array.isArray(data) || data.length === 0) {
                    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">No hay reservas para hoy.</td></tr>`;
                    return;
                }
                tbody.innerHTML = data.map(r => `
                    <tr class="hover:bg-gray-100         
                        ${r.paymentStatus === 'cancelado' ? 'bg-red-100' : ''}
                        ${r.paymentStatus === 'reembolsado_parcial' ? 'bg-yellow-100' : ''}">
                        <td class="border px-4 py-2">${r._id}</td>
                        <td class="border px-4 py-2">${r.product?.name || '-'}</td>
                        <td class="border px-4 py-2">${r.customerInfo?.name || '-'}</td>
                        <td class="border px-4 py-2">${new Date(r.startTime).toLocaleString('es-UY', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                        <td class="border px-4 py-2">${r.persons}</td>
                        <td class="border px-4 py-2">${r.paymentStatus}</td>
                    </tr>
                `).join('');
            })
            .catch(() => {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Error al cargar reservas.</td></tr>`;
            });
    });
}