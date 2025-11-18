// src/services/apiService.js

// Definimos las URL base de cada microservicio
const USERS_API_URL = 'http://localhost:8081/api';   // Login, Registro, Usuarios
const CATALOG_API_URL = 'http://localhost:8082/api'; // Productos
const ORDERS_API_URL = 'http://localhost:8083/api';  // Pedidos

/**
 * Función inteligente para elegir el puerto correcto según el endpoint
 */
const getBaseUrl = (endpoint) => {
    // 1. Microservicio de USUARIOS (8081)
    if (endpoint.startsWith('/auth') || endpoint.includes('/admin/usuarios')) {
        return USERS_API_URL;
    }
    // 2. Microservicio de CATÁLOGO (8082)
    if (endpoint.startsWith('/productos') || endpoint.includes('/admin/productos')) {
        return CATALOG_API_URL;
    }
    // 3. Microservicio de PEDIDOS (8083)
    if (endpoint.startsWith('/pedidos') || endpoint.includes('/admin/pedidos')) {
        return ORDERS_API_URL;
    }
    
    // Default (por seguridad)
    return USERS_API_URL;
};

/**
 * Obtiene el token de autenticación desde localStorage.
 */
const getToken = () => {
    const storedAuthData = localStorage.getItem('currentUser');
    if (storedAuthData) {
        try {
            const authData = JSON.parse(storedAuthData);
            return authData.token;
        } catch (e) {
            console.error("Error al parsear 'currentUser'", e);
            localStorage.removeItem('currentUser');
            return null;
        }
    }
    return null;
};

/**
 * Función principal para realizar peticiones fetch.
 */
const request = async (endpoint, method = 'GET', body = null, isPrivate = false) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (isPrivate) {
        const token = getToken();
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        } else {
            console.error('Petición privada sin token.');
            return Promise.reject(new Error('No autorizado. Token no encontrado.'));
        }
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    // AQUÍ OCURRE LA MAGIA: Seleccionamos la URL base dinámicamente
    const baseUrl = getBaseUrl(endpoint);
    const fullUrl = `${baseUrl}${endpoint}`;

    console.log(`[API] Llamando a: ${fullUrl}`); // Log para depurar

    try {
        const response = await fetch(fullUrl, config);

        if (response.status === 204) {
            return Promise.resolve(null);
        }

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.message || data.error || `Error ${response.status}`;
            console.error('Error en API:', errorMsg);
            return Promise.reject(new Error(errorMsg));
        }

        return data;
    } catch (error) {
        console.error('Error de red o fetch:', error);
        return Promise.reject(new Error('Error de conexión con el servidor.'));
    }
};

export const apiService = {
    get: (endpoint, isPrivate = false) => request(endpoint, 'GET', null, isPrivate),
    post: (endpoint, body, isPrivate = false) => request(endpoint, 'POST', body, isPrivate),
    put: (endpoint, body) => request(endpoint, 'PUT', body, true),
    patch: (endpoint, body) => request(endpoint, 'PATCH', body, true),
    delete: (endpoint) => request(endpoint, 'DELETE', null, true),
};