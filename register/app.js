document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM
    // Elementos del formulario de registro
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const rutInput = document.getElementById('rut');
    const birthDateInput = document.getElementById('birthDate');
    const emailInput = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordMatch = document.getElementById('passwordMatch');
    const passwordMismatch = document.getElementById('passwordMismatch');
    const passwordStrength = document.getElementById('passwordStrength');
    const registerForm = document.getElementById('registerForm');
    const termsAndConditions = document.getElementById('terms');

    // Módulo de validación de contraseña
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

    // Resto de funciones auxiliares (se mantienen igual)
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

    function validatePasswordStrength() {
        const validation = passwordValidator.validate(password.value);

        if (password.value === '') {
            passwordStrength.style.display = 'none';
        } else {
            showValidationFeedback(passwordStrength, validation.isValid, validation.message);
        }
    }

    function validatePasswordMatch() {
        const passwordsMatch = passwordValidator.match(password.value, confirmPassword.value);

        if (confirmPassword.value === '') {
            passwordMatch.style.display = 'none';
            passwordMismatch.style.display = 'none';
        } else if (passwordsMatch) {
            passwordMatch.style.display = 'block';
            passwordMismatch.style.display = 'none';
        } else {
            passwordMatch.style.display = 'none';
            passwordMismatch.style.display = 'block';
        }
    }

    function formatRutInput(e) {
        let rut = e.target.value.replace(/[.-]/g, '');
        if (rut.length > 1) {
            rut = rut.slice(0, -1) + '-' + rut.slice(-1).toUpperCase();
        }
        e.target.value = rut;
    }

    // Validación del formulario completo (actualizada con SweetAlert2)
    function validateForm(e) {
        e.preventDefault();

        // Validar campos vacíos
        if (!firstNameInput.value.trim()) {
            notification.showError('El nombre es obligatorio');
            firstNameInput.focus();
            return;
        }

        if (!lastNameInput.value.trim()) {
            notification.showError('El apellido es obligatorio');
            lastNameInput.focus();
            return;
        }

        if (!rutInput.value.trim()) {
            notification.showError('El RUT es obligatorio');
            rutInput.focus();
            return;
        }

        if (!birthDateInput.value) {
            notification.showError('La fecha de nacimiento es obligatoria');
            birthDateInput.focus();
            return;
        }

        if (!emailInput.value.trim()) {
            notification.showError('El correo electrónico es obligatorio');
            emailInput.focus();
            return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            notification.showError('Ingrese un correo electrónico válido');
            emailInput.focus();
            return;
        }

        if (!password.value.trim()) {
            notification.showError('La contraseña es obligatoria');
            password.focus();
            return;
        }

        // Validar fortaleza de contraseña
        const pwdValidation = passwordValidator.validate(password.value);
        if (!pwdValidation.isValid) {
            notification.showError(pwdValidation.message);
            password.focus();
            return;
        }

        // Validar coincidencia de contraseñas
        if (!passwordValidator.match(password.value, confirmPassword.value)) {
            notification.showError('Las contraseñas no coinciden');
            confirmPassword.focus();
            return;
        }

        // Validar si acepta las condiciones
        if (!termsAndConditions.checked) {
            notification.showError('Debe aceptar los términos y condiciones');
            termsAndConditions.focus();
            return;
        }

        // Si todo está correcto
        notification.showSuccess('Hemos enviado un correo electrónico a: ' + emailInput.value)
            .then(() => {
                registerForm.submit(); // Descomentar para enviar realmente
            });
    }

    // Event listeners (se mantienen igual)
    password.addEventListener('input', function () {
        validatePasswordStrength();
        validatePasswordMatch();
    });

    confirmPassword.addEventListener('input', validatePasswordMatch);
    document.getElementById('rut').addEventListener('input', formatRutInput);
    registerForm.addEventListener('submit', validateForm);
});