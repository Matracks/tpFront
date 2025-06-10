document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('buscar-form');
    const resultadoDiv = document.getElementById('resultado-reserva');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('reserva-id').value.trim();
        if (!id) return;

        resultadoDiv.innerHTML = '<p class="text-gray-500">Buscando reserva...</p>';

        fetch(`http://localhost:3000/rentals/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error || data.message) {
                    resultadoDiv.innerHTML = `<p class="text-red-500">${data.error || data.message}</p>`;
                    return;
                }
                resultadoDiv.innerHTML = `
                    <div class="bg-white rounded shadow p-4 mb-4">
                        <h2 class="text-lg font-bold mb-2">Reserva encontrada</h2>
                        <p><span class="font-semibold">ID:</span> ${data._id}</p>
                        <p><span class="font-semibold">Producto:</span> ${data.product.name}</p>
                        <p><span class="font-semibold">Cliente:</span> ${data.customerInfo?.name || '-'}</p>
                        <p><span class="font-semibold">Fecha y hora:</span> ${
                            (() => {
                                const d = new Date(data.startTime);
                                const yyyy = d.getFullYear();
                                const mm = (d.getMonth() + 1).toString().padStart(2, '0');
                                const dd = d.getDate().toString().padStart(2, '0');
                                const hh = d.getHours().toString().padStart(2, '0');
                                const min = d.getMinutes().toString().padStart(2, '0');
                                return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
                            })()
                        }</p>
                        <p><span class="font-semibold">Personas:</span> ${data.persons}</p>
                        <p><span class="font-semibold">Estado:</span> ${data.paymentStatus}</p>
                        <p><span class="font-semibold">Metodo de pago:</span> ${data.paymentMethod}</p>
                        ${data.paymentStatus === "cancelado" ? `<p><span class="font-semibold">Motivo:</span> ${data.cancellationReason}</p>` : `
                            
                        <button id="cancelar-btn" class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancelar reserva</button>
                            <div id="cancelar-msg" class="mt-2"></div>
                        `}
                    </div>
                `;

                const cancelarBtn = document.getElementById('cancelar-btn');
                if (cancelarBtn) {
                    cancelarBtn.onclick = function() {
                        console.log(data)
                        fetch(`http://localhost:3000/rentals/cancel/${data._id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' }
                        })
                        .then(res => res.json())
                        .then(resp => {
                            if (resp.error) {
                                document.getElementById('cancelar-msg').innerHTML = `<p class="text-red-500">${resp.error}</p>`;
                            } else {
                                document.getElementById('cancelar-msg').innerHTML = `<p class="text-green-600">Reserva cancelada correctamente.</p>`;
                            }
                        })
                        .catch(() => {
                            document.getElementById('cancelar-msg').innerHTML = `<p class="text-red-500">Error al cancelar la reserva.</p>`;
                        });
                    };
                }
            })
            .catch(() => {
                resultadoDiv.innerHTML = `<p class="text-red-500">No se pudo buscar la reserva.</p>`;
            });
    });
});