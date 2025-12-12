// Configuración de infraestructura:
// Estamos apuntando a la IP pública de tu instancia AWS (EC2).
// IMPORTANTE: Todas las URLs apuntan al mismo sitio porque asumimos que hay un API Gateway (Nginx o Spring Cloud Gateway)
// escuchando en el puerto 80/443 que redirige internamente a los puertos 8081, 8082, 8083.
const API_BASE = 'http://18.211.31.168/api'; 

const USERS_API_URL = API_BASE;   
const CATALOG_API_URL = API_BASE; 
const ORDERS_API_URL = API_BASE;

// Enrutador Lógico del Frontend:
// Aunque todas las constantes de arriba sean iguales ahora, mantenemos esta función
// para diferenciar conceptualmente a qué microservicio estamos llamando según el prefijo del endpoint.
const getBaseUrl = (endpoint) => {
    // 1. Microservicio de USUARIOS (Backend puerto 8081)
    if (endpoint.startsWith('/auth') || endpoint.includes('/admin/usuarios')) {
        return USERS_API_URL;
    }
    // 2. Microservicio de CATÁLOGO (Backend puerto 8082)
    if (endpoint.startsWith('/productos') || endpoint.includes('/admin/productos')) {
        return CATALOG_API_URL;
    }
    // 3. Microservicio de PEDIDOS (Backend puerto 8083)
    if (endpoint.startsWith('/pedidos') || endpoint.includes('/admin/pedidos')) {
        return ORDERS_API_URL;
    }
    // Fallback por defecto
    return USERS_API_URL;
};

/**
 * Helper de Seguridad: Recupera el JWT almacenado en el navegador.
 * Incluye un try-catch para evitar que la app explote si el string en localStorage está corrupto.
 */
const getToken = () => {
    const storedAuthData = localStorage.getItem('currentUser');
    if (storedAuthData) {
        try {
            const authData = JSON.parse(storedAuthData);
            return authData.token;
        } catch (e) {
            console.error("Error al parsear 'currentUser'", e);
            localStorage.removeItem('currentUser'); // Limpieza preventiva
            return null;
        }
    }
    return null;
};

/**
 * Wrapper Core de Fetch:
 * Centraliza toda la configuración de headers, manejo de tokens y errores HTTP.
 * Así evitamos repetir "fetch(...)" y "headers.append(...)" en cada componente.
 */
const request = async (endpoint, method = 'GET', body = null, isPrivate = false) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // Inyección de Seguridad:
    // Si el endpoint requiere permiso (isPrivate: true), adjuntamos el Bearer Token automáticamente.
    if (isPrivate) {
        const token = getToken();
        
        // DEBUG: Log para verificar que se está enviando el token correcto
        // Esto te ayudará a ver en la consola si el token es "null", "undefined" o uno válido
        console.log(`[API Security] Token enviado a ${endpoint}:`, token ? `${token.substring(0, 10)}...` : 'NULL');

        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        } else {
            console.error('Petición privada sin token.');
            // Rechazamos la promesa inmediatamente si no hay credenciales, ahorrándonos el viaje al servidor.
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

    // Resolución dinámica de la URL completa
    const baseUrl = getBaseUrl(endpoint);
    const fullUrl = `${baseUrl}${endpoint}`;

    console.log(`[API] Llamando a: ${fullUrl}`); 

    try {
        const response = await fetch(fullUrl, config);

        // Caso especial: 204 No Content (común en DELETE o Updates sin retorno).
        // Resolvemos null inmediatamente porque response.json() fallaría si el cuerpo está vacío.
        if (response.status === 204) {
            return Promise.resolve(null);
        }

        // --- MANEJO ROBUSTO DE LA RESPUESTA ---
        // Leemos como texto primero para evitar el error "Unexpected end of JSON input"
        // si el servidor devuelve un error 403/500 con cuerpo vacío o texto plano.
        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            // Si falla el parseo, usamos el texto plano como mensaje
            console.warn("La respuesta no es un JSON válido:", text);
            data = { message: text || `Error ${response.status}` };
        }

        // Manejo centralizado de errores de API (400, 401, 403, 500).
        // Si el fetch fue exitoso técnicamente pero el servidor respondió error, lanzamos excepción aquí.
        if (!response.ok) {
            
            // Diagnóstico específico para 403
            if (response.status === 403) {
                console.error("ERROR 403: El servidor rechazó el token. Posibles causas: Token expirado, rol insuficiente o formato inválido.");
            }

            const errorMsg = data.message || data.error || `Error ${response.status}`;
            console.error('Error en API:', errorMsg);
            return Promise.reject(new Error(errorMsg));
        }

        return data;
    } catch (error) {
        // Errores de red (DNS, timeout, servidor caído).
        console.error('Error de red o fetch:', error);
        return Promise.reject(new Error(error.message || 'Error de conexión con el servidor.'));
    }
};

// Exportamos una interfaz limpia para que los componentes solo llamen a apiService.get('/ruta')
export const apiService = {
    get: (endpoint, isPrivate = false) => request(endpoint, 'GET', null, isPrivate),
    post: (endpoint, body, isPrivate = false) => request(endpoint, 'POST', body, isPrivate),
    // PUT, PATCH y DELETE suelen ser siempre privadas en nuestra lógica de negocio, por eso el true forzado.
    put: (endpoint, body) => request(endpoint, 'PUT', body, true),
    patch: (endpoint, body) => request(endpoint, 'PATCH', body, true),
    delete: (endpoint) => request(endpoint, 'DELETE', null, true),
};