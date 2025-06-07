document.addEventListener('DOMContentLoaded', () => {
    const codeInputs = document.querySelectorAll('.code-input');
    const verificationForm = document.getElementById('verificationForm');
    const userEmailSpan = document.getElementById('userEmail');

    //Obtener parámetros de la URL
    const emailFromUrl = getQueryParam('email'); // Recupera el email de la URL
    if (emailFromUrl){
        userEmailSpan.textContent = `${emailFromUrl}.`;
    }

    codeInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            // Asegurarse de que solo se ingrese un dígito
            if (e.target.value.length > 1) {
                e.target.value = e.target.value.slice(0, 1);
            }

            // Mover el foco al siguiente input si se ingresó un dígito
            if (e.target.value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            // Permitir borrar y mover el foco al input anterior
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });

    verificationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const enteredCode = Array.from(codeInputs).map(input => input.value).join('');

        if (enteredCode.length !== 6) {
            // Usando el módulo de notificación globalmente disponible
            notification.showError('Por favor, ingresa el código completo de 6 dígitos.');
            return;
        }

        // Aquí es donde integraría la lógica de validación del backend
        // Por ahora, simularemos una validación exitosa o fallida
        console.log('Código ingresado:', enteredCode);

        // Ejemplo de simulación de validación
        if (enteredCode === '123456') { // Código de ejemplo para éxito
            // Usando el módulo de notificación globalmente disponible
            notification.showSuccess('El código ha sido validado correctamente.').then(() => {
                // Redirigir o realizar otra acción después de la validación exitosa
                // window.location.href = 'pagina-de-exito.html';
            });
        } else {
            // Usando el módulo de notificación globalmente disponible
            notification.showError('El código ingresado no es válido. Intenta de nuevo.');
        }
    });

    // Lógica para reenviar código (puedes añadir implementación de backend aquí)
    document.getElementById('resendCode').addEventListener('click', (e) => {
        e.preventDefault();
        // Usando el módulo de notificación globalmente disponible
        notification.showAlert('Reenviar Código', 'Se ha enviado un nuevo código a tu correo electrónico a ' + emailFromUrl, 'info', {
            showConfirmButton: false,
            timer: 2000

        });
        borrarCasillas() // Limpiar las casillas de entrada
        // Aquí podrías añadir una llamada a la API para reenviar el código
    });

    function borrarCasillas() {
        codeInputs.forEach(input => {
            input.value = ''; // Simplemente limpia el valor de cada input
        });
    }

    // Función para obtener parámetros de la URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
});