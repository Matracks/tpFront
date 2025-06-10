document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/products/')
        .then(response => response.json())
        .then(data => {
            console.log('Familias de productos:', data);
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
        });
});