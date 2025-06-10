document.addEventListener('DOMContentLoaded', () => {
    // Obtener el id del producto desde la URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    fetch(`http://localhost:3000/products/${id}`)
        .then(response => response.json())
        .then(producto => {
            const contenedor = document.getElementById('detalle-producto');
            contenedor.innerHTML = `
                <img src="../images/${producto.imageUrl || 'placeholder.png'}" alt="${producto.name}" class="w-48 h-48 object-cover mb-4 rounded">
                <h2 class="text-2xl font-bold mb-2">${producto.name}</h2>
                <p class="text-gray-600 mb-2">${producto.description || ''}</p>
                <span class="text-emerald-600 font-semibold block mb-2">Precio por turno: $${producto.pricePerTurn || ''}</span>
                <p class="text-sm text-gray-500 mb-1">Máx. personas: ${producto.maxPeople || '-'}</p>
                <p class="text-sm text-gray-500 mb-1">Dispositivos de seguridad: ${producto.requiresSafetyDevices ? 'Sí' : 'No'}</p>
                ${producto.requiresSafetyDevices ? `<p class="text-sm text-gray-500 mb-1">Precio dispositivos: $${producto.safetyDevicesPrice || '-'}</p>` : ''}
                <div class="my-4">
                    <label for="fecha" class="block mb-2 font-semibold">Selecciona una fecha:</label>
                    <input type="date" id="fecha" class="border rounded px-2 py-1"/>
                </div>
                <div id="horarios-disponibles" class="mt-4"></div>
            `;

            // Evento para buscar horarios al seleccionar una fecha
            const inputFecha = document.getElementById('fecha');
            let horarioSeleccionado = null;

            inputFecha.addEventListener('change', () => {
                const fecha = inputFecha.value;
                if (!fecha) return;

            const hoyStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
            const fechaSeleccionadaStr = fecha; // "YYYY-MM-DD"

            if (fechaSeleccionadaStr < hoyStr) {
                const horariosDiv = document.getElementById('horarios-disponibles');
                horariosDiv.innerHTML = `<p class="text-red-500">No se pueden reservar días pasados.</p>`;
                return;
            }
        
        fetch(`http://localhost:3000/rentals/${producto._id}/${fecha}`)
            .then(res => res.json())
            .then(reservas => {
                const todosLosTurnos = [
                    "10:00", "10:30", "11:00", "11:30",
                    "12:00", "12:30", "13:00", "13:30",
                    "14:00", "14:30", "15:00", "16:30",
                    "21:30",
                ];
                console.log(reservas)
                const turnosReservados = (reservas.productTimes || []).map(t => {
                    const date = new Date(t);
                    // Obtener la hora local en formato HH:mm
                    const hh = date.getHours().toString().padStart(2, '0');
                    const mm = date.getMinutes().toString().padStart(2, '0');
                    return `${hh}:${mm}`;
                });

                let turnosDisponibles = todosLosTurnos.filter(hora => !turnosReservados.includes(hora));

                // Ocultar horarios pasados si la fecha seleccionada es hoy
                const hoyStr = new Date().toISOString().slice(0, 10);
                if (fecha === hoyStr) {
                    const ahora = new Date();
                    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
                    turnosDisponibles = turnosDisponibles.filter(hora => {
                        const [h, m] = hora.split(':').map(Number);
                        const minutosTurno = h * 60 + m;
                        return minutosTurno > minutosAhora;
                    });
                }

                const horariosDiv = document.getElementById('horarios-disponibles');
                if (turnosDisponibles.length === 0) {
                    horariosDiv.innerHTML = `<p class="text-red-500">No hay horarios disponibles para esta fecha.</p>`;
                    return;
                }
                horariosDiv.innerHTML = `
                    <p class="font-semibold mb-2">Horarios disponibles:</p>
                    <div id="botones-horarios" class="flex flex-wrap gap-2 mb-4">
                        ${turnosDisponibles.map(hora => `<button type="button" class="px-3 py-1 bg-emerald-100 rounded hover:bg-emerald-300" data-hora="${hora}">${hora}</button>`).join('')}
                    </div>
                    <div id="formulario-reserva"></div>
                `;

                // Selección de horario
                document.querySelectorAll('#botones-horarios button').forEach(btn => {
                    btn.addEventListener('click', () => {
                        horarioSeleccionado = btn.getAttribute('data-hora');
                        document.querySelectorAll('#botones-horarios button').forEach(b => b.classList.remove('bg-emerald-400'));
                        btn.classList.add('bg-emerald-400');
                        mostrarFormularioReserva();
                    });
                });

            function mostrarFormularioReserva() {
                if (!horarioSeleccionado) return;
                const formDiv = document.getElementById('formulario-reserva');
                formDiv.innerHTML = `
                    <form id="reserva-form" class="space-y-2 mt-4">
                        <input type="hidden" name="hora" value="${horarioSeleccionado}">
                        <div>
                            <label class="block">Cantidad de personas:</label>
                            <input type="number" name="persons" min="1" max="${producto.maxPeople || 1}" value="1" required class="border rounded px-2 py-1 w-20">
                        </div>
                        <button type="submit" class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">Reservar</button>
                    </form>
                    <div id="mensaje-reserva" class="mt-2"></div>
                `;

                document.getElementById('reserva-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    const formData = new FormData(this);
                    const customerInfo = {
                        name: producto.name,
                        email: "",
                        phone: "",
                        idNumber: ""
                    };
                    const persons = parseInt(formData.get('persons'), 10);
                    const fechaSeleccionada = new Date(`${fecha}T${horarioSeleccionado}:00`);
                    
                    fechaSeleccionada.setHours(fechaSeleccionada.getHours()-3);
                    const startTime = fechaSeleccionada.toISOString().slice(0, 19);
                    const totalAmount = producto.pricePerTurn  + (producto.requiresSafetyDevices ? (producto.safetyDevicesPrice || 0) * persons : 0);
                    const reserva = {
                        customerInfo,
                        persons,
                        product: producto._id,
                        startTime,
                        paymentMethod: "",
                        paymentStatus: "pendiente",
                        totalAmount,
                        discountApplied: 0,
                        finalAmount: totalAmount
                    };

                    // Validar si ya existe una reserva igual en el carrito
                    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
                    const yaExiste = reservas.some(r =>
                        r.product === reserva.product &&
                        r.startTime === reserva.startTime
                    );
                    if (yaExiste) {
                        document.getElementById('mensaje-reserva').innerHTML = `<p class="text-red-500">Ya tienes una reserva para este producto y horario en el carrito.</p>`;
                        return;
                        }

                    // Guardar en localStorage
                    reservas.push(reserva);
                    localStorage.setItem('reservas', JSON.stringify(reservas));

                    document.getElementById('mensaje-reserva').innerHTML = `<p class="text-green-600">¡Reserva agregada al carrito!</p>`;
                    console.log(localStorage.getItem('reservas'))
                });
            }
        })
        .catch(() => {
            document.getElementById('horarios-disponibles').innerHTML = `<p class="text-red-500">Error al cargar horarios.</p>`;
        });
            });
        })
        .catch(error => {
            document.getElementById('detalle-producto').innerHTML = `<p class="text-red-500">Error al cargar el producto.</p>`;
            console.error('Error al cargar el producto:', error);
        });
});