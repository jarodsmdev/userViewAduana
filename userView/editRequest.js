document.addEventListener('DOMContentLoaded', function () {
    // Obtener el ID de la solicitud a editar
    const requestId = localStorage.getItem('editingRequestId');
    // Selecciona el input de archivos y el contenedor de la lista de archivos
    const fileInput = document.getElementById('documents');
    const fileListContainer = document.getElementById('fileList');
    const dropzone = document.getElementById('documentsDropzone');
    // Botón para borrar todos los archivos
    const clearFilesButton = document.getElementById('clearFilesButton');
    const btnCerrarSesion = document.getElementById('logoutButton');
    
    // Array para almacenar TODOS los archivos (existentes + nuevos)
    let allFiles = [];

    if (!requestId) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró la solicitud a editar',
            willClose: () => {
                window.location.href = 'userView.html';
            }
        });
        return;
    }

    // Obtener la solicitud del localStorage
    const requests = JSON.parse(localStorage.getItem('solicitudesData')) || [];
    const request = requests.find(req => req.id === requestId);

    if (!request) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La solicitud no existe',
            willClose: () => {
                window.location.href = 'userView.html';
            }
        });
        return;
    }

    // Rellenar el formulario con los datos existentes
    document.getElementById('merchandiseType').value = request.detalles.tipo_mercancia;
    document.getElementById('weight').value = request.detalles.peso_kg;
    document.getElementById('description').value = request.detalles.descripcion;
    document.getElementById('origin').value = request.detalles.origen;
    document.getElementById('destination').value = request.detalles.destino;

    // Función para actualizar el input de archivos con el contenido de allFiles
    function updateFileInput() {
        const dataTransfer = new DataTransfer();
        allFiles.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
        updateFileList(allFiles);
    }

    // Función para agregar nuevos archivos manteniendo los existentes
    function addFiles(newFiles) {
        // Filtrar archivos válidos (tamaño y no duplicados)
        const validFiles = newFiles.filter(file => {
            const isDuplicate = allFiles.some(f => f.name === file.name);
            return file.size <= 5 * 1024 * 1024 && !isDuplicate;
        });

        const invalidFiles = newFiles.filter(file => 
            file.size > 5 * 1024 * 1024 || 
            allFiles.some(f => f.name === file.name)
        );

        if (invalidFiles.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Archivos no válidos',
                text: `${invalidFiles.length} archivo(s) no se agregaron (tamaño excedido o duplicados)`,
                timer: 3000
            });
        }

        if (validFiles.length > 0) {
            allFiles = [...allFiles, ...validFiles];
            updateFileInput();
        }
    }

    // Manejar envío del formulario
    document.getElementById('requestForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Filtrar documentos existentes: mantener solo los que están en allFiles
        const updatedDocumentacion = request.documentacion.filter(doc =>
            allFiles.some(file => file.name === doc.nombre)
        );

        // Agregar nuevos archivos (los que no existen en la documentación original)
        const newFiles = allFiles.filter(file =>
            !request.documentacion.some(doc => doc.nombre === file.name)
        );

        const newDocumentacion = newFiles.map(file => ({
            tipo: determineFileType(file.name),
            nombre: file.name,
            formato: file.name.split('.').pop().toLowerCase(),
            url: `/uploads/${requestId}/${file.name}`,
            fecha_subida: new Date().toISOString()
        }));

        // Actualizar la solicitud
        const updatedRequest = {
            ...request,
            detalles: {
                ...request.detalles,
                tipo_mercancia: document.getElementById('merchandiseType').value,
                descripcion: document.getElementById('description').value,
                peso_kg: parseFloat(document.getElementById('weight').value),
                origen: document.getElementById('origin').value,
                destino: document.getElementById('destination').value
            },
            documentacion: [
                ...updatedDocumentacion,
                ...newDocumentacion
            ],
            fecha_actualizacion: new Date().toISOString(),
            historial: [
                ...request.historial,
                {
                    fecha: new Date().toISOString(),
                    accion: "actualizacion",
                    usuario: request.usuario.email,
                    comentario: getUpdateComment(newFiles.length, updatedDocumentacion.length !== request.documentacion.length)
                }
            ]
        };

        // Guardar cambios en localStorage
        const updatedRequests = requests.map(req => req.id === requestId ? updatedRequest : req);
        localStorage.setItem('solicitudesData', JSON.stringify(updatedRequests));

        // Mostrar confirmación
        Swal.fire({
            icon: 'success',
            title: '¡Cambios guardados!',
            text: `La solicitud ${requestId} ha sido actualizada`,
            willClose: () => {
                localStorage.removeItem('editingRequestId');
                window.location.href = 'userView.html';
            }
        });
    });

    // Función auxiliar para generar mensaje de historial
    function getUpdateComment(newFilesCount, hasRemovedFiles) {
        const actions = [];
        if (newFilesCount > 0) actions.push(`agregó ${newFilesCount} nuevo(s) documento(s)`);
        if (hasRemovedFiles) actions.push('eliminó documento(s) existente(s)');

        return actions.length > 0
            ? `Solicitud modificada: ${actions.join(' y ')}`
            : 'Solicitud modificada sin cambios en documentos';
    }
    
    function determineFileType(filename) {
        const lowerName = filename.toLowerCase();

        if (lowerName.includes('factura')) return 'factura_comercial';
        if (lowerName.includes('identificacion') || lowerName.includes('rut')) return 'identificacion';
        if (lowerName.includes('certificado')) return 'certificado_origen';
        if (lowerName.includes('fotografia') || lowerName.includes('imagen')) return 'fotografia_productos';

        return 'otro';
    }

    // Manejar cancelación con confirmación
    document.getElementById('cancelButton').addEventListener('click', function (e) {
        e.preventDefault();

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Tienes cambios sin guardar. ¿Quieres cancelar la edición?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, seguir editando'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('editingRequestId');
                window.location.href = 'userView.html';
            }
        });
    });

    // Manejar cambio en el input de archivos
    fileInput.addEventListener('change', function () {
        const newFiles = Array.from(fileInput.files);
        addFiles(newFiles);
    });

    // Función para actualizar la lista de archivos
    function updateFileList(files) {
        fileListContainer.innerHTML = '';
        
        if (files.length === 0) {
            fileListContainer.innerHTML = '<div class="alert alert-info">No hay archivos adjuntos</div>';
            return;
        }

        files.forEach(file => {
            const isExisting = request.documentacion.some(doc => doc.nombre === file.name);
            
            const listItem = document.createElement('div');
            listItem.className = 'd-flex justify-content-between align-items-center mb-1';
            listItem.innerHTML = `
                <span>
                    ${file.name}
                    ${isExisting ? '<span class="badge bg-secondary ms-2">Existente</span>' : ''}
                </span>
                <button class="btn btn-danger btn-sm remove-file" data-filename="${file.name}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            fileListContainer.appendChild(listItem);
        });
    }

    // Manejar eliminación de archivos
    fileListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-file') || e.target.closest('.remove-file')) {
            const button = e.target.classList.contains('remove-file') ? e.target : e.target.closest('.remove-file');
            const fileName = button.getAttribute('data-filename');
            
            allFiles = allFiles.filter(file => file.name !== fileName);
            updateFileInput();
        }
    });

    // Manejo de arrastrar y soltar
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('bg-light');
    });
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('bg-light');
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('bg-light');
        const newFiles = Array.from(e.dataTransfer.files);
        addFiles(newFiles);
    });

    // Limpiar todos los archivos
    clearFilesButton.addEventListener('click', () => {
        Swal.fire({
            title: '¿Desea quitar todos los archivos adjuntos?',
            text: "Esta acción no puede deshacerse",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, quitar todos',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                allFiles = [];
                updateFileInput();
            }
        });
    });

    // Cerrar sesión
    btnCerrarSesion.addEventListener('click', () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¿Estás seguro de que deseas cerrar sesión?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../../index.html';
            }
        });
    });

    // Cargar archivos existentes al iniciar
    function loadExistingFiles() {
        if (request.documentacion && request.documentacion.length > 0) {
            allFiles = request.documentacion.map(doc => {
                const blob = new Blob([], { type: `application/${doc.formato}` });
                return new File([blob], doc.nombre, {
                    type: `application/${doc.formato}`,
                    lastModified: new Date(doc.fecha_subida).getTime()
                });
            });
            updateFileInput();
        }
    }

    loadExistingFiles();
});