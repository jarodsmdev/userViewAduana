
document.addEventListener('DOMContentLoaded', function () {
    // Obtener elementos del DOM
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    const passwordMatch = document.getElementById('passwordMatch');
    const passwordMismatch = document.getElementById('passwordMismatch');
    const resetPasswordForm = document.getElementById('resetPasswordForm');

    // Inicializar estados (ocultar mensajes al cargar)
    passwordMatch.style.display = 'none';
    passwordMismatch.style.display = 'none';

    // Event listeners para validación en tiempo real
    newPassword.addEventListener('input', validatePasswordStrength);
    confirmNewPassword.addEventListener('input', validatePasswordMatch);

    // Función para validar fortaleza de contraseña
    function validatePasswordStrength() {
        const validation = passwordValidator.validate(newPassword.value);
        // Aquí podrías agregar lógica para mostrar fortaleza si lo deseas
        // Por ejemplo: showPasswordStrengthIndicator(validation);
    }

    // Función para validar coincidencia de contraseñas
    function validatePasswordMatch() {
        const passwordsMatch = passwordValidator.match(newPassword.value, confirmNewPassword.value);

        // Ocultar ambos mensajes primero
        passwordMatch.style.display = 'none';
        passwordMismatch.style.display = 'none';

        // Solo mostrar feedback si hay texto en confirmación
        if (confirmNewPassword.value.trim() !== '') {
            if (passwordsMatch) {
                passwordMatch.style.display = 'block';
            } else {
                passwordMismatch.style.display = 'block';
            }
        }
    }

    // Manejar el envío del formulario
    resetPasswordForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validar fortaleza de contraseña
        const passwordValidation = passwordValidator.validate(newPassword.value);
        if (!passwordValidation.isValid) {
            notification.showError(passwordValidation.message);
            newPassword.focus();
            return;
        }

        // Validar coincidencia
        if (!passwordValidator.match(newPassword.value, confirmNewPassword.value)) {
            notification.showError('Las contraseñas no coinciden');
            confirmNewPassword.focus();
            return;
        }

        notification.showAlert(
            'Contraseña actualizada',
            'Tu contraseña ha sido cambiada correctamente. Serás redirigido al inicio de sesión...',
            'success',
            {
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                willClose: () => {
                    window.location.href = '../index.html'; // Ajusta esta ruta según tu estructura
                }
            }
        );
    });
});