document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos del usuario (simulado - en una app real esto vendría de la sesión)
    const currentUser = {
        rut: "12345678-9",
        nombre: "Juan Pérez",
        email: "juan.perez@example.com",
        telefono: "+56912345678"
    };

    // Manejar el envío del formulario
    const requestForm = document.getElementById('requestForm');
    requestForm.addEventListener('submit', function(e) {
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
                valor_aduana_clp: 0, // Podrías agregar un campo para esto en el formulario
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
    document.getElementById('clearFilesButton').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('documents').value = '';
        document.getElementById('fileList').innerHTML = '';
    });

    
});