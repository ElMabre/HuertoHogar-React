import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

// Crear el contexto de productos
const ProductContext = createContext();

/**
 * Hook personalizado para acceder al contexto de productos
 * Esto lo que hace es: Permite que los componentes accedan fácilmente al contexto sin usar useContext directamente
 * Esto es para: Simplificar el acceso a la lista de productos desde cualquier componente
 */
export const useProducts = () => {
  return useContext(ProductContext);
};

/**
 * ProductProvider Component
 * Esto lo que hace es: Proporciona el contexto de productos a toda la aplicación
 * Esto es para: Gestionar el estado global de productos (lista, carga, errores, búsquedas)
 */
export const ProductProvider = ({ children }) => {
  // Estado para almacenar la lista de todos los productos disponibles
  const [products, setProducts] = useState([]);
  // Estado para indicar si se están cargando los productos desde el backend
  const [loading, setLoading] = useState(true);
  // Estado para almacenar mensajes de error en caso de fallo en la carga
  const [error, setError] = useState(null);

  /**
   * Función: Obtener todos los productos del backend
   * Esto lo que hace es: Realiza una llamada a la API para traer todos los productos disponibles
   * Esto es para: Llenar el catálogo de la tienda al iniciar la aplicación
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // apiService redirige esto al microservicio de catálogo (puerto 8082)
      const data = await apiService.get('/productos', false);
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Efecto: Cargar productos al iniciar la aplicación
   * Esto lo que hace es: Ejecuta fetchProducts cuando el componente se monta
   * Esto es para: Obtener la lista de productos apenas se inicia la app
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Función: Buscar un producto por su ID
   * Esto lo que hace is: Encuentra un producto específico en la lista usando su id
   * Esto es para: Obtener detalles de un producto individual en la página de detalle
   */
  const getProductById = (id) => {
    if (!id) return null;
    // Compara como string para evitar errores de tipo (número vs texto)
    return products.find(p => p.id.toString() === id.toString());
  };

  /**
   * Función: Filtrar productos por categoría
   * Esto lo que hace is: Devuelve solo los productos que pertenecen a una categoría específica
   * Esto es para: Mostrar productos filtrados por categoría en la página de productos
   */
  const getProductsByCategory = (category) => {
    return products.filter(p => p.categoria === category);
  };

  /**
   * Función: Obtener productos destacados
   * Esto lo que hace is: Devuelve los primeros N productos de la lista
   * Esto es para: Mostrar productos destacados en la página de inicio (recomendaciones)
   */
  const getFeaturedProducts = (limit = 3) => {
    return products.slice(0, limit);
  };

  /**
   * Función: Refrescar la lista de productos
   * Esto lo que hace is: Vuelve a cargar los productos desde el backend
   * Esto es para: Actualizar el catálogo sin necesidad de recargar toda la aplicación
   */
  const refreshProducts = async () => {
    await fetchProducts();
  };

  // Objeto con todos los valores y funciones que proporciona el contexto
  const value = {
    products,                  // Lista completa de productos disponibles
    loading,                   // Indica si se están cargando los productos
    error,                     // Mensaje de error si falla la carga
    getProductById,            // Función para buscar por ID
    getProductsByCategory,     // Función para filtrar por categoría
    getFeaturedProducts,       // Función para obtener destacados
    refreshProducts            // Función para recargar productos
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};