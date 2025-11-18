import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // apiService redirige esto al microservicio de catálogo (8082)
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductById = (id) => {
    if (!id) return null;
    // Compara como string para evitar errores de tipo (número vs texto)
    return products.find(p => p.id.toString() === id.toString());
  };

  const getProductsByCategory = (category) => {
    return products.filter(p => p.categoria === category);
  };

  const getFeaturedProducts = (limit = 3) => {
    return products.slice(0, limit);
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const value = {
    products,
    loading,
    error,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    refreshProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};