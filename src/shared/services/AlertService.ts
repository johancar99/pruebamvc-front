import Swal from 'sweetalert2';

type AlertType = 'success' | 'error' | 'warning' | 'info' | 'question';

export const AlertService = {
  /**
   * Muestra una alerta genérica.
   * @param type Tipo de alerta (success, error, warning, info, question)
   * @param title Título de la alerta.
   * @param text Mensaje de la alerta.
   */
  showAlert(type: AlertType, title: string, text: string): void {
    Swal.fire({
      icon: type,
      title,
      text,
    });
  },

  /**
   * Muestra una alerta de éxito.
   * @param text Mensaje de la alerta.
   * @param title Título de la alerta (por defecto 'Success').
   */
  showSuccess(text: string, title = 'Success'): void {
    this.showAlert('success', title, text);
  },

  /**
   * Muestra una alerta de error.
   * @param text Mensaje de la alerta.
   * @param title Título de la alerta (por defecto 'Oops...').
   */
  showError(text: string, title = 'Oops...'): void {
    this.showAlert('error', title, text);
  },

  /**
   * Muestra una alerta de advertencia.
   * @param text Mensaje de la alerta.
   * @param title Título de la alerta (por defecto 'Warning').
   */
  showWarning(text: string, title = 'Warning'): void {
    this.showAlert('warning', title, text);
  },
};
