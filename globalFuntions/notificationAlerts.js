// Módulo de notificaciones con SweetAlert2
    const notification = {
        /**
         * Muestra una alerta usando SweetAlert2
         * @param {string} title - Título de la alerta
         * @param {string} text - Texto del mensaje (opcional)
         * @param {string} icon - Tipo de icono ('success', 'error', 'warning', 'info', 'question')
         * @param {object} config - Configuración adicional para SweetAlert2
         */
        showAlert: function (title, text = '', icon = 'info', config = {}) {
            const defaultConfig = {
                title: title,
                text: text,
                icon: icon,
                confirmButtonText: 'Aceptar',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn btn-primary'
                }
            };

            return Swal.fire({ ...defaultConfig, ...config });
        },

        /**
         * Muestra un mensaje de error
         * @param {string} message - Mensaje de error
         */
        showError: function (message) {
            return this.showAlert('Al parecer tenemos un problema', message, 'error');
        },

        /**
         * Muestra un mensaje de éxito
         * @param {string} message - Mensaje de éxito
         */
        showSuccess: function (message) {
            return this.showAlert('Registro Exitoso', message, 'success');
        }
    };