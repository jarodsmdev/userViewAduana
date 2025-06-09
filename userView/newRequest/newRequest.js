document.addEventListener('DOMContentLoaded', function () {
    // Obtener datos del usuario (simulado - en una app real esto vendría de la sesión)
    const currentUser = {
        rut: "12345678-9",
        nombre: "Juan Pérez",
        email: "juan.perez@example.com",
        telefono: "+56912345678"
    };

    // Array para almacenar TODOS los archivos (como en editar solicitud)
    let allFiles = [];
    const fileInput = document.getElementById('documents');
    const fileListContainer = document.getElementById('fileList');
    const dropzone = document.getElementById('documentsDropzone');

    // Función para actualizar el input de archivos con el contenido de allFiles
    function updateFileInput() {
        const dataTransfer = new DataTransfer();
        allFiles.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
        updateFileList(allFiles);
    }

        function updateFileList(files) {
        fileListContainer.innerHTML = '';
        
        if (files.length === 0) {
            fileListContainer.innerHTML = '<div class="alert alert-info">No hay archivos adjuntos</div>';
            return;
        }

        files.forEach(file => {
            const listItem = document.createElement('div');
            listItem.className = 'd-flex justify-content-between align-items-center mb-1';
            listItem.innerHTML = `
                <span>${file.name}</span>
                <button class="btn btn-danger btn-sm remove-file" data-filename="${file.name}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            fileListContainer.appendChild(listItem);
        });
    }

    // Manejar cambio en el input de archivos (ahora acumula)
    fileInput.addEventListener('change', function() {
        addFiles(Array.from(fileInput.files));
    });

    // Manejar eliminación de archivos
    fileListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-file') || e.target.closest('.remove-file')) {
            const button = e.target.classList.contains('remove-file') ? e.target : e.target.closest('.remove-file');
            const fileName = button.getAttribute('data-filename');
            
            allFiles = allFiles.filter(file => file.name !== fileName);
            updateFileInput();
        }
    });

    // Manejo de arrastrar y soltar (opcional, como en editar)
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('bg-light');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('bg-light'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('bg-light');
        addFiles(Array.from(e.dataTransfer.files));
    });

    // Limpiar todos los archivos
    document.getElementById('clearFilesButton').addEventListener('click', function(e) {
        e.preventDefault();
        Swal.fire({
            title: '¿Desea quitar todos los archivos adjuntos?',
            text: "Esta acción no puede deshacerse",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, quitar todos',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                allFiles = [];
                updateFileInput();
            }
        });
    });

    // Función para agregar nuevos archivos (igual que en editar)
    function addFiles(newFiles) {
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

    // Manejar el envío del formulario
    const requestForm = document.getElementById('requestForm');
    requestForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validar archivos subidos
        const filesInput = document.getElementById('documents');
        if (filesInput.files.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Documentos requeridos',
                text: 'Debes adjuntar al menos un documento'
            });
            return;
        }

        // Crear objeto con los datos del formulario
        const newRequest = {
            id: generateRequestId(),
            usuario: currentUser,
            estado: "en_revision",
            fecha_creacion: new Date().toISOString(),
            fecha_actualizacion: new Date().toISOString(),
            detalles: {
                tipo_mercancia: document.getElementById('merchandiseType').value,
                descripcion: document.getElementById('description').value,
                peso_kg: parseFloat(document.getElementById('weight').value),
                valor_aduana_clp: 0, // >TODO: Podrías agregar un campo para esto en el formulario
                origen: document.getElementById('origin').value,
                destino: document.getElementById('destination').value,
                tipo_operacion: determineOperationType(document.getElementById('origin').value)
            },
            documentacion: processUploadedFiles(filesInput.files),
            historial: [
                {
                    fecha: new Date().toISOString(),
                    accion: "creacion",
                    usuario: currentUser.email,
                    comentario: "Solicitud creada por el usuario"
                }
            ]
        };

        // Guardar en localStorage
        saveToLocalStorage(newRequest);

        // Mostrar confirmación
        Swal.fire({
            icon: 'success',
            title: 'Solicitud creada',
            text: `Tu solicitud ${newRequest.id} ha sido registrada correctamente`,
            willClose: () => {
                window.location.href = '../userView.html';
            }
        });
    });

    // Función para generar ID de solicitud (ej: AD-2023-003)
    function generateRequestId() {
        const now = new Date();
        const year = now.getFullYear();
        const requests = JSON.parse(localStorage.getItem('solicitudesData')) || [];
        const lastRequest = requests[requests.length - 1];
        let lastNumber = 0;

        if (lastRequest) {
            const lastIdParts = lastRequest.id.split('-');
            lastNumber = parseInt(lastIdParts[2]);
        }

        return `AD-${year}-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Determinar si es importación o exportación (Chile como referencia)
    function determineOperationType(origin) {
        return origin.toLowerCase() === "chile" ? "exportacion" : "importacion";
    }

    // Procesar archivos subidos (simulación - en un caso real necesitarías subirlos a un servidor)
    function processUploadedFiles(files) {
        const documents = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileType = determineFileType(file.name);

            documents.push({
                tipo: fileType,
                nombre: file.name,
                formato: file.name.split('.').pop().toLowerCase(),
                url: `/uploads/${generateRequestId()}/${file.name}`, // Ruta simulada
                fecha_subida: new Date().toISOString()
            });
        }

        return documents;
    }

    // Determinar tipo de documento (simplificado)
    function determineFileType(filename) {
        const lowerFilename = filename.toLowerCase();

        if (lowerFilename.includes('factura')) return 'factura_comercial';
        if (lowerFilename.includes('identidad') || lowerFilename.includes('rut')) return 'identificacion';
        if (lowerFilename.includes('certificado')) return 'certificado_origen';

        return 'otro';
    }

    // Guardar en localStorage
    function saveToLocalStorage(newRequest) {
        let requests = JSON.parse(localStorage.getItem('solicitudesData')) || [];
        requests.push(newRequest);
        localStorage.setItem('solicitudesData', JSON.stringify(requests));
    }

    // Manejar el botón de borrar archivos
    document.getElementById('clearFilesButton').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('documents').value = '';
        document.getElementById('fileList').innerHTML = '';
    });
});