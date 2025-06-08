# UserViewAduana

**UserViewAduana** es una aplicación web, demo para la asignatura de Ingeniería de Software que simula la gestión de solicitudes de paso por aduana, orientada a usuarios que desean importar o exportar mercancías desde/hacia Chile. Permite visualizar, filtrar, crear, modificar y eliminar solicitudes, así como ver el detalle de cada una, incluyendo documentación y su historial.

## Características

- Visualización de todas las solicitudes de aduana del usuario.
- Filtros por estado, fecha y búsqueda por texto.
- Modal de detalles con información completa de la solicitud, documentación adjunta e historial.
- Creación de nuevas solicitudes.
- Edición y eliminación de solicitudes existentes.
- Persistencia de datos usando `localStorage` y carga inicial desde un archivo `data.json`.
- Interfaz responsiva basada en Bootstrap 5.
- Iconos de Font Awesome.
- Notificaciones y confirmaciones con SweetAlert2.

## Estructura del Proyecto

```bash
UserViewAduana/
│
├── userView/
│   ├── userView.html         # Página principal de solicitudes
│   ├── app.js                # Lógica principal de la aplicación
│   ├── styles.css            # Estilos personalizados
│   ├── data.json             # Datos de ejemplo de solicitudes
│   └── newRequest/
│       └── newRequest.html   # Formulario para nueva solicitud
│
├── register/                 # Registro de usuarios
├── forgotPassword/           # Recuperación de contraseña
├── resetPassword/            # Restablecimiento de contraseña
├── validation/               # Validación de código de registro
├── assets/                   # Archivos JS y CSS compartidos
├── index.html                # Login principal
└── README.md                 # Este archivo
```

## Instalación y Uso

1. **Clona el repositorio o descarga los archivos.**

2. **Abre `index.html` en tu navegador.**

   > No requiere backend ni instalación de dependencias para la vista de usuario.  
   > Si usas rutas relativas y tienes problemas de CORS al cargar `data.json`, puedes abrir el proyecto con una extensión de servidor local, por ejemplo:
   >
   > ```sh
   > python3 -m http.server 8080
   > ```
   > Luego visita [http://localhost:8080/index.html](http://localhost:8080/index.html)

3. **Navega por la aplicación:**
   - Visualiza tus solicitudes.
   - Usa los filtros para buscar o filtrar por estado/fecha.
   - Haz clic en "Ver Detalles" para abrir el modal con toda la información.
   - Crea nuevas solicitudes desde el botón "Nueva Solicitud".

## Dependencias

- [Bootstrap 5](https://getbootstrap.com/)
- [Font Awesome 6](https://fontawesome.com/)
- [SweetAlert2](https://sweetalert2.github.io/)

Todas las dependencias se cargan vía CDN.

## Personalización

- Puedes modificar los datos de ejemplo en `userView/data.json`.
- Los estilos personalizados están en `userView/styles.css`.
- La lógica principal está en `userView/app.js`.

## Créditos

Desarrollado por **Leonel Briones Palacios**  
© 2025. Todos los derechos reservados.

---

¿Dudas o sugerencias? ¡Contribuye o abre un issue!