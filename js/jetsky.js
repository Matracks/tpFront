document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/products/family/JetSky')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const contenedor = document.getElementById('lista-jetsky');
            contenedor.innerHTML = '';
            data.forEach(producto => {
                const div = document.createElement('div');
                div.className = 'bg-white rounded shadow p-4 flex flex-col items-center hover:shadow-lg group cursor-pointer';
                div.innerHTML = `
                <a href="../pages/detalle.html?id=${producto._id}" class="w-full flex flex-col items-center">
                    <img src="../images/${producto.imageUrl || 'https://via.placeholder.com/150'}" alt="${producto.name}" class="w-32 h-32 object-cover mb-2 rounded">
                    <h2 class="text-lg font-bold mb-1 transition group-hover:underline">${producto.name}</h2>
                    <p class="text-gray-600 mb-1">${producto.description || ''}</p>
                    <span class="text-emerald-600 font-semibold">Precio por turno: $${producto.pricePerTurn || ''}</span>
                    <p class="text-sm text-gray-500">Máx. personas: ${producto.maxPeople || '-'}</p>
                    <p class="text-sm text-gray-500">Dispositivos de seguridad: ${producto.requiresSafetyDevices ? 'Sí' : 'No'}</p>
                    ${producto.requiresSafetyDevices ? `<p class="text-sm text-gray-500">Precio dispositivos: $${producto.safetyDevicesPrice || '-'}</p>` : ''}
                </a>
                `;
                contenedor.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error al cargar jetskis:', error);
        });
});