# AcquaSport - Sistema de Reservas

Este proyecto es un **trabajo práctico universitario** para la materia de Full Stack. Consiste en una aplicación web para la gestión de reservas de productos acuáticos (como tablas de surf) en AcquaSport. Incluye funcionalidades para usuarios y administración.

---

## Tecnologías utilizadas

- **Frontend**: HTML, CSS (Tailwind), JavaScript
- **Backend**: Node.js (no incluido en este repo)
- **Consumo de API REST** para todas las operaciones de reservas

---

## Funcionalidades principales

- **Reserva de productos**: Los usuarios pueden seleccionar productos, elegir fecha y horario, y reservar turnos disponibles.
- **Carrito de reservas**: Los usuarios pueden agregar, ver y eliminar reservas antes de confirmar.
- **Buscar reserva**: Permite consultar el estado de una reserva por su ID.
- **Panel de administración**: Acceso restringido para gestionar reservas, cancelar por tormenta, liberar reservas impagas y listar reservas del día.
- **Login de administrador**: Acceso seguro para el panel de administración.

---


## Instalación y ejecución

1. **Clona el repositorio** o descarga los archivos.
2. Asegúrate de tener el backend corriendo en `http://localhost:3000` (o el puerto configurado).
3. Abre `index.html` o cualquier página del frontend en tu navegador.

---

## Uso

- **Reservar**: Desde la página principal, elige un producto, selecciona fecha y horario, y agrégalo al carrito.
- **Carrito**: Visualiza y elimina reservas antes de confirmar.
- **Buscar reserva**: Ingresa el ID de tu reserva para ver su estado o cancelarla.
- **Admin**: Ingresa como administrador desde `/pages/loginAdmin.html` para acceder al panel y gestionar reservas.

---

## Notas

- Este proyecto es solo para fines académicos.
- Si tienes dudas, revisa los comentarios en los archivos `.js` para entender la lógica de cada funcionalidad.