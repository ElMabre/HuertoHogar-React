import { useEffect } from 'react';

/**
 * Hook personalizado para actualizar el título de la pestaña del navegador.
 * @param {string} title - El título que se mostrará en la pestaña.
 */
function useDocumentTitle(title) {
  useEffect(() => {
    // Actualiza el título del documento cuando el componente se monta
    // o cuando el 'title' cambia.
    document.title = `${title} - HuertoHogar`;
  }, [title]); // El efecto se ejecuta cada vez que el valor de 'title' cambia
}

export default useDocumentTitle;