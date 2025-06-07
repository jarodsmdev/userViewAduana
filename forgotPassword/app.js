document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const emailInput = document.getElementById("recoveryEmail");
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    // Validar email y manejar el envío
    function validateRecoveryEmail() {
        const email = emailInput.value.trim();
        
        if (!email) {
            notification.showError('El correo electrónico es obligatorio');
            emailInput.focus();
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            notification.showError('Ingrese un correo electrónico válido');
            emailInput.focus();
            return false;
        }
        
        return true;
    }

    // Manejar el envío del formulario
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateRecoveryEmail()) {
            // Solo mostrar éxito si la validación pasa
            notification.showSuccess(`Se ha enviado un enlace de recuperación a: ${emailInput.value.trim()}`)
                .then(() => {
                    // Aquí iría el envío real al backend
                    // forgotPasswordForm.submit();
                    
                    // Opcional: Resetear el formulario después de enviar
                    forgotPasswordForm.reset();
                });
        }
    });
});