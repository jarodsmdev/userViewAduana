document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos los elementos del DOM
    const btnCancelButton = document.getElementById('cancelButton');
    // Selecciona el input de archivos y el contenedor de la lista de archivos
    const fileInput = document.getElementById('documents');
    const fileListContainer = document.getElementById('fileList');
    const dropzone = document.getElementById('documentsDropzone');
    // Botón para borrar todos los archivos
    const clearFilesButton = document.getElementById('clearFilesButton');
    const btnCerrarSesion = document.getElementById('logoutButton'); // Botón de cerrar sesión

    // Añadimos el evento de clic al botón de cancelar
    btnCancelButton.addEventListener('click', (event) => {
        // Es un enlace, disfrazado de boton con bootstrap
        event.preventDefault();
        // Mostramos una alerta de confirmación
        Swal.fire({
            title: '¿Cancelar solicitud?',
            text: "Los cambios no guardados se perderán",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, continuar en ella',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../userView.html';
            }
        });

    })



    // Escucha el evento de cambio en el input de archivos
    fileInput.addEventListener('change', function () {
        const files = Array.from(fileInput.files);
        updateFileList(files);
    });

    // Función para actualizar la lista de archivos
    function updateFileList(files) {
        fileListContainer.innerHTML = '';

        files.forEach((file) => {
            const listItem = document.createElement('div');
            listItem.className = 'd-flex justify-content-between align-items-center mb-1';
            listItem.innerHTML = `
            <span>${file.name}</span>
            <button class="btn btn-danger btn-sm remove-file" data-filename="${file.name}"><i class="fas fa-trash-alt"></i></button>
        `;
            fileListContainer.appendChild(listItem);
        });
    }

    // Agregar un solo event listener al contenedor
    fileListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-file') || e.target.closest('.remove-file')) {
            const button = e.target.classList.contains('remove-file') ? e.target : e.target.closest('.remove-file');
            const fileName = button.getAttribute('data-filename');
            removeFile(fileName);
        }
    });

    // Función para eliminar un archivo de la lista
    function removeFile(fileName) {
        const files = Array.from(fileInput.files);
        const updatedFiles = files.filter(file => file.name !== fileName); // Filtra el archivo a eliminar
        const dataTransfer = new DataTransfer(); // Crea un nuevo DataTransfer para actualizar el input
        updatedFiles.forEach(file => dataTransfer.items.add(file)); // Agrega los archivos restantes
        fileInput.files = dataTransfer.files; // Actualiza el input de archivos
        updateFileList(updatedFiles); // Actualiza la lista mostrada
    }

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
        const files = Array.from(e.dataTransfer.files);
        const currentFiles = Array.from(fileInput.files);
        const allFiles = [...currentFiles, ...files];
        const validFiles = allFiles.filter(file => file.size <= 5 * 1024 * 1024); // Filtra archivos mayores a 5MB
        const invalidFiles = allFiles.filter(file => file.size > 5 * 1024 * 1024);

        if (invalidFiles.length > 0) {
            alert('Algunos archivos exceden el tamaño máximo de 5MB.');
        }

        const dataTransfer = new DataTransfer();
        validFiles.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
        updateFileList(validFiles);
    });


    //Primero debe preguntar si se está seguro de borrar todos los archivos

    clearFilesButton.addEventListener('click', () => {
        Swal.fire({
            title: '¿Desea quitar todos los archivos adjuntos?',
            text: "La solicitud aún se puede seguir editando",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, quitar todos',
            cancelButtonText: 'No, deseo conservarlos',
            reverseButtons: true
        }).then((result) => {
            fileInput.value = ''; // Limpia el input de archivos
            fileListContainer.innerHTML = ''; // Limpia la lista de archivos mostrada
        });

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
                window.location.href = '../../index.html'; // Cambia a tu ruta de login
            }
        });
    });

});