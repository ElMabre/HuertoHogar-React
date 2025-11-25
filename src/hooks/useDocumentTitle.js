import { useEffect } from 'react';

/**
 * Hook personalizado para actualizar el título de la pestaña del navegador.
 * @param {string} title El título que se mostrará en la pestaña.
 */
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} - HuertoHogar`;
  }, [title]); 
}

export default useDocumentTitle;