
const passwordValidator = {
    validate: function (pwd) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasNumbers = /\d/.test(pwd);

        if (pwd.length < minLength) {
            return {
                isValid: false,
                message: `La contraseña debe tener al menos ${minLength} caracteres`
            };
        }

        if (!hasUpperCase) {
            return {
                isValid: false,
                message: 'La contraseña debe contener al menos una mayúscula'
            };
        }

        if (!hasLowerCase) {
            return {
                isValid: false,
                message: 'La contraseña debe contener al menos una minúscula'
            };
        }

        if (!hasNumbers) {
            return {
                isValid: false,
                message: 'La contraseña debe contener al menos un número'
            };
        }

        return {
            isValid: true,
            message: 'Contraseña válida'
        };
    },

    match: function (pwd1, pwd2) {
        return pwd1 === pwd2 && pwd1 !== '';
    }
};

// Función para mostrar feedback de validación
function showValidationFeedback(element, isValid, message) {
    if (isValid) {
        element.style.display = 'block';
        element.style.color = 'green';
        element.textContent = message;
    } else {
        element.style.display = 'block';
        element.style.color = 'red';
        element.textContent = message;
    }
}