document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const emailInput = $('email');
    const passwordInput = $('password');
    const btnLogin = $('login');

    // Añadimos el evento de clic al botón de login
    btnLogin.addEventListener('click', (event) =>{
        //event.preventDefault(); // Prevenir el envío del formulario

        // Validar campos
        if (emailInput.value.trim() === '' || passwordInput.value.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Campos Vacíos',
                text: 'Por favor, completa todos los campos.'
            });
            return;
        }

        // Aquí iría la lógica para autenticar al usuario
        // Por ejemplo, enviar una solicitud al servidor

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Has iniciado sesión correctamente.'
        }).then(() => {
            window.location.href = './userView/userView.html'; // Redirigir a la vista de usuario
        });
    });


    // Función para obtener un elemento por su ID
    function $(element) {
        return document.getElementById(element);
    }
});

