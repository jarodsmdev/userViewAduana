
// Aquí irá la lógica JavaScript para manejar la pantalla
document.addEventListener('DOMContentLoaded', function () {
    // Lógica para cargar los datos del usuario desde localStorage o API
    loadUserData();

    // Manejar el botón de edición
    document.getElementById('editProfileBtn').addEventListener('click', enableEditMode);

    // Manejar el botón de cancelar edición
    document.getElementById('cancelEditBtn').addEventListener('click', disableEditMode);

    // Manejar el botón de guardar cambios
    document.getElementById('saveChangesBtn').addEventListener('click', saveUserData);

    // Manejar el cambio de foto de perfil
    document.getElementById('profilePicture').addEventListener('click', function () {
        if (document.getElementById('editProfileBtn').style.display === 'none') {
            document.getElementById('profilePictureInput').click();
        }
    });

    document.getElementById('profilePictureInput').addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (event) {
                document.getElementById('profilePicture').src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Manejar el botón para agregar documentos
    document.getElementById('addDocumentBtn').addEventListener('click', function () {
        const modal = new bootstrap.Modal(document.getElementById('addDocumentModal'));
        modal.show();
    });

    // Manejar el botón de subir documento
    document.getElementById('uploadDocumentBtn').addEventListener('click', uploadDocument);

    // Manejar el botón de cerrar sesión
    btnLogoutSideBar = document.getElementById('logoutButton2');
    btnLogoutNavBar = document.getElementById('logoutButton');

    btnLogoutNavBar.addEventListener('click', function () {
        handleLogout();
    });

    btnLogoutSideBar.addEventListener('click', function () {
        handleLogout();
    });

    function handleLogout() {
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
                localStorage.removeItem('currentUser');
                window.location.href = '../../index.html';
            }
        });
    };
    function loadUserData() {
        // Aquí deberías cargar los datos del usuario desde localStorage o una API
        const userData = JSON.parse(localStorage.getItem('currentUser')) || {
            firstName: "Juan",
            lastName: "Pérez González",
            rut: "12.345.678-9",
            birthDate: "1985-05-15",
            gender: "male",
            nationality: "Chilena",
            email: "juan.perez@example.com",
            phone: "+56912345678",
            address: "Av. Libertador Bernardo O'Higgins 123",
            city: "Santiago",
            region: "Metropolitana",
            profilePicture: "https://ui-avatars.com/api/?name=Juan+Perez&background=random"
        };

        // Actualizar la interfaz con los datos del usuario
        document.getElementById('profilePicture').src = userData.profilePicture;
        document.getElementById('userFullName').textContent = `${userData.firstName} ${userData.lastName}`;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('firstName').value = userData.firstName;
        document.getElementById('lastName').value = userData.lastName;
        document.getElementById('rut').value = userData.rut;
        document.getElementById('birthDate').value = userData.birthDate;
        document.getElementById('gender').value = userData.gender;
        document.getElementById('nationality').value = userData.nationality;
        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.phone;
        document.getElementById('address').value = userData.address;
        document.getElementById('city').value = userData.city;
        document.getElementById('region').value = userData.region;
    }

    function enableEditMode() {
        // Habilitar todos los campos de edición
        const inputs = document.querySelectorAll('#personalInfoForm input, #contactInfoForm input, #personalInfoForm select');
        inputs.forEach(input => {
            input.readOnly = false;
            input.disabled = false;
            input.classList.add('bg-white');
        });

        // Mostrar botones de guardar/cancelar
        document.getElementById('editProfileBtn').style.display = 'none';
        document.getElementById('cancelEditBtn').style.display = 'block';
        document.getElementById('saveChangesBtn').style.display = 'block';
    }

    function disableEditMode() {
        // Deshabilitar todos los campos de edición
        const inputs = document.querySelectorAll('#personalInfoForm input, #contactInfoForm input, #personalInfoForm select');
        inputs.forEach(input => {
            input.readOnly = true;
            if (input.tagName === 'SELECT') {
                input.disabled = true;
            }
            input.classList.remove('bg-white');
        });

        // Ocultar botones de guardar/cancelar y mostrar el de editar
        document.getElementById('editProfileBtn').style.display = 'block';
        document.getElementById('cancelEditBtn').style.display = 'none';
        document.getElementById('saveChangesBtn').style.display = 'none';

        // Recargar los datos originales
        loadUserData();
    }

    function saveUserData() {
        // Obtener los datos del formulario
        const userData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            rut: document.getElementById('rut').value,
            birthDate: document.getElementById('birthDate').value,
            gender: document.getElementById('gender').value,
            nationality: document.getElementById('nationality').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            region: document.getElementById('region').value,
            profilePicture: document.getElementById('profilePicture').src
        };

        // Guardar en localStorage (en un caso real, harías una llamada a la API)
        localStorage.setItem('currentUser', JSON.stringify(userData));

        // Mostrar confirmación
        Swal.fire({
            icon: 'success',
            title: '¡Cambios guardados!',
            text: 'Tus datos se han actualizado correctamente',
            timer: 2000
        });

        // Salir del modo edición
        disableEditMode();
    }

    function uploadDocument() {
        const fileInput = document.getElementById('documentFile');
        const documentType = document.getElementById('documentType').value;

        if (!fileInput.files || fileInput.files.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar un archivo'
            });
            return;
        }

        const file = fileInput.files[0];
        if (file.size > 5 * 1024 * 1024) { // 5MB
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El archivo es demasiado grande (máximo 5MB)'
            });
            return;
        }

        // Simular subida del documento (en un caso real, subirías a un servidor)
        Swal.fire({
            title: 'Subiendo documento...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Documento subido',
                        text: 'El documento se ha agregado correctamente'
                    });

                    // Cerrar el modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addDocumentModal'));
                    modal.hide();

                    // Actualizar la tabla de documentos (simulado)
                    const documentsTable = document.getElementById('documentsTable');
                    const newRow = documentsTable.insertRow();

                    let documentTypeText = '';
                    switch (documentType) {
                        case 'identification': documentTypeText = 'Identificación'; break;
                        case 'address_proof': documentTypeText = 'Comprobante de Domicilio'; break;
                        case 'tax_id': documentTypeText = 'RUT'; break;
                        default: documentTypeText = 'Otro';
                    }

                    const today = new Date();
                    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

                    newRow.innerHTML = `
                            <td>${documentTypeText}</td>
                            <td>${file.name}</td>
                            <td>${formattedDate}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        `;

                    // Limpiar el formulario
                    document.getElementById('documentUploadForm').reset();
                }, 1500);
            }
        });
    }
    // Obtener el botón de cambiar contraseña
    btnChangePassword = document.getElementById('changePasswordBtn');
    btnChangePassword.addEventListener('click', function () {
        handleChangePassword();
    });

    // Función para cambiar la contraseña
    function handleChangePassword() {
        // Mostrar confirmación al usuario
        Swal.fire({
            title: '¿Cambiar la contraseña?',
            text: "Será redirigido a la pantalla de cambio de contraseña. ¿Estás seguro?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, Continuar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../resetPassword/resetPassword.html'; // <-- ajusta esta ruta si es diferente
            }
        });
    }



    // Eliminar LocalStorage de la aplicación
    btnEliminarLocalStorage = document.getElementById('deleteAccountBtn');

    btnEliminarLocalStorage.addEventListener('click', function () {
        clearLocalStorageData();
    });

    function clearLocalStorageData() {
        // Mostrar confirmación al usuario
        Swal.fire({
            title: '¿Limpiar datos de la aplicación?',
            text: "Esto eliminará tu información de usuario y solicitudes. ¿Estás seguro?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, limpiar todo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Eliminar los datos específicos
                localStorage.removeItem('currentUser');
                localStorage.removeItem('solicitudesData');

                // Opcional: Eliminar cualquier otro dato relacionado
                localStorage.removeItem('editingRequestId');

                // Mostrar confirmación
                Swal.fire({
                    title: '¡Datos eliminados!',
                    text: 'La información se ha borrado correctamente, será redirigido a la página principal.',
                    icon: 'success',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => {
                    // Redirigir al usuario a la página principal después de cerrarse automáticamente
                    window.location.href = '../index.html';
                });

            }
        });
    }
});


