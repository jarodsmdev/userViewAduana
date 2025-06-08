document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES Y SELECTORES GLOBALES (o accesibles en este ámbito) ---
    const requestsContainer = document.getElementById('requestsContainer'); // Contenedor de las tarjetas
    const requestDetailModalElement = document.getElementById('requestDetailModal');
    const requestDetailModal = new bootstrap.Modal(requestDetailModalElement); // Instancia del modal de Bootstrap
    const detailModalTitle = document.getElementById('detailModalTitle');
    const detailContent = document.getElementById('detailContent');
    const btnCerrarSesion = document.getElementById('logoutButton'); // Botón de cerrar sesión


    let allRequestsData = []; // Para almacenar todas las solicitudes

    // Mapeo de estados a clases y texto para las tarjetas y el modal
    const statusClasses = {
        'en_revision': 'bg-warning text-dark',
        'aprobado': 'bg-success text-white',
        'rechazado': 'bg-danger text-white',
        'pendiente': 'bg-info text-white'
    };

    const statusText = {
        'en_revision': 'En revisión',
        'aprobado': 'Aprobado',
        'rechazado': 'Rechazado',
        'pendiente': 'Pendiente'
    };


    // Función auxiliar para obtener clase CSS del badge según estado
    function getStatusBadgeClass(status) {
        return statusClasses[status] || 'bg-secondary text-white';
    }

    // Función auxiliar para obtener icono según tipo de archivo (si tienes archivos adjuntos)
    function getFileIcon(fileType) {
        const icons = {
            'pdf': 'pdf',
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'docx': 'word',
            'xlsx': 'excel',
            'txt': 'alt'
        };
        return icons[fileType] || 'alt';
    }

    // --- FUNCIONES DE CREACIÓN Y RENDERIZADO DE TARJETAS ---

    // Función para crear una tarjeta de solicitud
    function createRequestCard(request) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        const card = document.createElement('div');
        card.className = 'card request-card mb-4';

        card.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <h5 class="card-title">Solicitud #${request.id}</h5>
                    <span class="badge ${getStatusBadgeClass(request.estado)} status-badge">
                        ${statusText[request.estado]}
                    </span>
                </div>
                <p class="card-text">
                    <small class="text-muted">
                        <i class="fas fa-calendar-alt me-1"></i>
                        ${new Date(request.fecha_creacion).toLocaleDateString()}
                    </small>
                </p>
                <p class="card-text">Mercancía: ${request.detalles.tipo_mercancia}</p>
                <p class="card-text">${request.detalles.descripcion.substring(0, 50)}...</p>
                <div class="d-grid gap-2">
                    <button class="btn btn-sm btn-outline-primary btn-action view-details" data-id="${request.id}">
                        <i class="fas fa-eye me-1"></i> Ver Detalles
                    </button>
                    <button class="btn btn-sm btn-outline-secondary btn-action edit-request" data-id="${request.id}">
                        <i class="fas fa-edit me-1"></i> Modificar
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-action delete-request" data-id="${request.id}">
                        <i class="fas fa-trash-alt me-1"></i> Eliminar
                    </button>
                </div>
            </div>
        `;

        col.appendChild(card);
        return col;
    }

    // Función para renderizar las solicitudes y adjuntar listeners
    function renderRequests(requests) {
        requestsContainer.innerHTML = ''; // Limpiar contenedor
        requests.forEach(request => {
            const requestCard = createRequestCard(request);
            requestsContainer.appendChild(requestCard);
        });

        // --- Delegación de eventos para los botones de las tarjetas ---
        requestsContainer.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (event) => {
                // El ID es un string en el atributo data-id, pero el find necesita un número
                // si los IDs de tus requests son números. Asegúrate de la consistencia.
                const requestId = event.currentTarget.dataset.id;
                showRequestDetails(requestId);
            });
        });

        requestsContainer.querySelectorAll('.delete-request').forEach(button => {
            button.addEventListener('click', function (event) {
                const requestId = event.currentTarget.dataset.id; // Mantener como string si el ID es string en el objeto
                Swal.fire({
                    title: '¿Eliminar solicitud?',
                    text: "Esta acción no se puede deshacer",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        deleteRequestFromLocalStorage(requestId);
                        Swal.fire({
                            title: 'Eliminada!',
                            text: `La solicitud #${requestId} ha sido eliminada.`,
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            willClose: () => {
                                console.log('Alerta cerrada después de 2 segundos');
                            }
                        });
                        // Lógica para eliminar del localStorage y luego recargar:
                        // removeRequestFromLocalStorage(requestId); // Implementar esta función
                        // renderRequests(allRequestsData); // Re-renderizar después de la eliminación
                    }
                });
            });
        });
    }

    // --- FUNCION DE MODAL DETALLES ---

    // Función para mostrar los detalles de la solicitud en el modal
    function showRequestDetails(requestId) {
        // Asegúrate de que el ID sea del mismo tipo que en tus objetos (número o string)
        const request = allRequestsData.find(req => req.id == requestId); // Usar '==' para comparación flexible si los tipos son diferentes

        if (request) {
            detailModalTitle.textContent = `Detalles de Solicitud #${request.id}`;
            detailContent.innerHTML = `
            <p><strong>Estado:</strong> <span class="badge ${getStatusBadgeClass(request.estado)}">${statusText[request.estado]}</span></p>
            <p><strong>Fecha de Creación:</strong> ${new Date(request.fecha_creacion).toLocaleDateString()}</p>
            <p><strong>Tipo de Mercancía:</strong> ${request.detalles.tipo_mercancia}</p>
            <p><strong>Descripción:</strong> ${request.detalles.descripcion}</p>
            <p><strong>Peso (kg):</strong> ${request.detalles.peso_kg}</p>
            <p><strong>Valor Aduana (CLP):</strong> $${request.detalles.valor_aduana_clp.toLocaleString('es-CL')}</p>
            <p><strong>Origen:</strong> ${request.detalles.origen}</p>
            <p><strong>Destino:</strong> ${request.detalles.destino}</p>
            <p><strong>Tipo de Operación:</strong> ${request.detalles.tipo_operacion}</p>
            <hr>
            <h6>Documentación Adjunta:</h6>
            <ul>
                ${request.documentacion.map(doc => `
                    <li>
                        <a href="${doc.url}" target="_blank">
                            <i class="fas fa-file-${getFileIcon(doc.formato)} me-1"></i>
                            ${doc.nombre}
                        </a>
                    </li>
                `).join('')}
            </ul>
            <hr>
            <h6>Historial:</h6>
            <ul>
                ${request.historial.map(h => `
                    <li>
                        <strong>${new Date(h.fecha).toLocaleString()}:</strong> ${h.accion} - ${h.comentario}
                    </li>
                `).join('')}
            </ul>
        `;
            requestDetailModal.show();
        } else {
            console.error('Solicitud no encontrada para el ID:', requestId);
            // notification.showError('Error', 'No se pudo cargar los detalles de la solicitud.');
        }
    }


    // --- LÓGICA DE INICIO Y CARGA DE DATOS (MODIFICADA) ---
    // Nueva función para eliminar una solicitud del array y del localStorage
    function deleteRequestFromLocalStorage(idToDelete) {
        // Filtra el array `allRequestsData` para crear uno nuevo sin la solicitud a eliminar
        // Asume que los IDs son comparables (ambos números o ambos strings)
        const initialLength = allRequestsData.length;
        allRequestsData = allRequestsData.filter(request => request.id != idToDelete);

        if (allRequestsData.length < initialLength) {
            // Si la longitud cambió, significa que se eliminó algo
            localStorage.setItem('solicitudesData', JSON.stringify(allRequestsData));
            console.log(`Solicitud #${idToDelete} eliminada y localStorage actualizado.`);
            renderRequests(allRequestsData); // Re-renderiza las tarjetas para reflejar el cambio
        } else {
            console.warn(`Solicitud #${idToDelete} no encontrada para eliminar.`);
        }
    }
    // Nueva función para cargar las solicitudes
    async function loadRequests() {
        const storedRequests = localStorage.getItem('solicitudesData');
        let parsedRequests = [];

        if (storedRequests) {
            try {
                parsedRequests = JSON.parse(storedRequests);
            } catch (e) {
                console.warn('No se pudo parsear localStorage, se usará data.json:', e);
            }
        }

        if (parsedRequests.length > 0) {
            allRequestsData = parsedRequests;
            console.log('Datos cargados desde localStorage.');
        } else {
            try {
                const response = await fetch('./data.json');
                const data = await response.json();
                allRequestsData = data.solicitudes;
                localStorage.setItem('solicitudesData', JSON.stringify(allRequestsData));
                console.log('Datos cargados desde data.json y guardados en localStorage.');
            } catch (error) {
                console.error('Error cargando los datos:', error);
            }
        }

        renderRequests(allRequestsData); // Siempre renderizar después de cargar
        setupFilters(allRequestsData); // Siempre configurar filtros después de cargar
    }

    // Llama a la nueva función de carga al inicio del DOMContentLoaded
    loadRequests();

    // Función placeholder para setupFilters (deberías tener tu implementación real)
    function setupFilters(requests) {
        console.log('Filtros configurados con', requests.length, 'solicitudes.');
        // Implementación de la lógica de filtros aquí
    }


    // Listener para el botón "Enviar Solicitud" (si es un modal de creación de solicitud)
    document.getElementById('submitRequest')?.addEventListener('click', function () {
        const form = document.getElementById('requestForm'); // Asume que el form del modal tiene id 'requestForm'

        if (form && form.checkValidity()) {
            Swal.fire({
                title: '¿Confirmar envío?',
                text: "¿Estás seguro de que deseas enviar esta solicitud?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, enviar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Enviada!',
                        'Tu solicitud ha sido registrada.',
                        'success'
                    ).then(() => {
                        // Cerrar modal y recargar listado
                        const modal = bootstrap.Modal.getInstance(document.getElementById('newRequestModal'));
                        if (modal) modal.hide();
                        // Aquí iría la lógica para enviar la solicitud al backend,
                        // actualizar `allRequestsData` (agregar la nueva solicitud)
                        // y luego guardar `allRequestsData` en localStorage de nuevo
                        // y finalmente re-renderizar `renderRequests(allRequestsData);`
                    });
                }
            });
        } else {
            if (form) form.reportValidity(); // Muestra los mensajes de error de HTML5
        }
    });

    // Listener para el botón de cerrar sesión
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
                // Aquí iría la lógica para cerrar sesión, como redirigir al login
                window.location.href = '../index.html'; // Cambia a tu ruta de login
            }
        });
    });

});