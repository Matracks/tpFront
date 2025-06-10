document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('lista-carrito');
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const form = document.getElementById('cliente-form');
    const montoTotalInput = document.getElementById('monto-total');

    // Aplica 10% de descuento si hay 3 o más reservas
    let reservasConDescuento = reservas;
    if (reservas.length >= 3) {
        reservasConDescuento = reservas.map(r => {
            const descuento = r.finalAmount * 0.10;
            return {
                ...r,
                discountApplied: descuento,
                finalAmount: r.finalAmount - descuento
            };
        });
        // Actualiza el localStorage con los descuentos aplicados
        localStorage.setItem('reservas', JSON.stringify(reservasConDescuento));
    }

    if (reservas.length === 0) {
        contenedor.innerHTML = `<p class="text-gray-500">No hay reservas en el carrito.</p>`;
        form.classList.add('hidden');
        return;
    }

    contenedor.innerHTML = reservasConDescuento.map((reserva, i) => `
        <div class="bg-white rounded shadow p-4 flex flex-col gap-2 relative">
        <button 
            class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 borrar-reserva"
            data-index="${i}"
            title="Borrar reserva"
        >Borrar</button>
            <h2 class="text-lg font-bold mb-1">Reserva #${i + 1}</h2>
            <p><span class="font-semibold">Producto:</span> ${reserva.customerInfo.name}</p>
            <p><span class="font-semibold">Personas:</span> ${reserva.persons}</p>
            <p><span class="font-semibold">Fecha y hora:</span> ${reserva.startTime.replace('T', ' ')}</p>
            <p><span class="font-semibold">Total:</span> $${reserva.finalAmount.toFixed(2)}</p>
            ${reserva.discountApplied ? `<p class="text-green-600 text-sm">Descuento aplicado: $${reserva.discountApplied.toFixed(2)}</p>` : ""}
        </div>
    `).join('');
    form.classList.remove('hidden');

    // Evento para borrar reserva del carrito
    document.querySelectorAll('.borrar-reserva').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            reservas.splice(idx, 1);
            localStorage.setItem('reservas', JSON.stringify(reservas));
            location.reload();
        });
    });

    // Muestra el monto total sumando todos los finalAmount
    const montoTotal = reservasConDescuento.reduce((acc, r) => acc + r.finalAmount, 0);
    montoTotalInput.value = `$${montoTotal.toFixed(2)}`;

    form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const customerInfo = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        idNumber: formData.get('idNumber')
    };
    const paymentMethod = formData.get('paymentMethod');
    console.log('Método de pago:', paymentMethod);
    // Actualiza cada reserva con los datos del cliente y método de pago
    const reservasAEnviar = reservas.map(r => ({
        ...r,
        customerInfo,
        paymentMethod
    }));

    fetch('http://localhost:3000/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservasAEnviar)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Respuesta del backend:', data);
        if (data.error) {
            document.getElementById('mensaje-final').innerHTML = `<p class="text-red-500">Error: ${data.error || data.message || 'No se pudo realizar la reserva.'}</p>`;
            localStorage.removeItem('reservas');
            return;
        }
        // Si hay reservas exitosas, muestra los IDs para luego poder cancelarlas
        if (Array.isArray(data.rentals)) {
            const ids = data.rentals.map(r => `<li class="font-mono">${r._id}</li>`).join('');
            document.getElementById('mensaje-final').innerHTML = `
                <p class="text-green-600">¡Reservas confirmadas y enviadas!</p>
                <p class="mt-2">Números de reserva (guárdalos para cancelar):</p>
                <ul class="mt-1">${ids}</ul>
            `;
        } else if (data.message) {
            document.getElementById('mensaje-final').innerHTML = `<p class="text-green-600">${data.message}</p>`;
        } else {
            document.getElementById('mensaje-final').innerHTML = `<p class="text-green-600">¡Reservas confirmadas y enviadas!</p>`;
        }
        localStorage.removeItem('reservas');
        contenedor.innerHTML = '';
        form.classList.add('hidden');
    })
    .catch(() => {
        document.getElementById('mensaje-final').innerHTML = `<p class="text-red-500">Error al enviar las reservas.</p>`;
    });
});

});