// AuthService.js
const BASE_URL = 'http://suvalsa-home.ddns.net:8091';

const timeout = (ms) => new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
);

const retry = async (fn, retriesLeft = 5, interval = 1000) => {
    try {
        const response = await fn();
        console.log('Respuesta recibida:', response.status);
        return response;
    } catch (error) {
        console.log(`Error en reintento, intentos restantes: ${retriesLeft}. Error:`, error);
        if (retriesLeft === 0) {
            throw new Error('Max retries reached');
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
        return retry(fn, retriesLeft - 1, interval);
    }
};

export const loginUser = async (email, password) => {
    console.log('Entraste en el Fetch AuthService');

    const makeRequest = async () => {
        try {
            console.log('Realizando petición a:', `${BASE_URL}/usuariosLogin/email/${email}`);
            const response = await Promise.race([
                fetch(`${BASE_URL}/usuariosLogin/email/${email}`),
                timeout(30000)  // 30 segundos de tiempo de espera
            ]);

            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos:', data);
            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Network request failed') {
                console.log('Fallo en la solicitud de red. ¿Está el servidor disponible? ¿Estás conectado a internet?');
            }
            throw error;  // Re-throw the error to be handled by the retry logic
        }
    };

    try {
        const data = await retry(makeRequest);
        if (data.length > 0) {
            const user = data.find((u) => u.email === email);
            if (user && user.password === password) {
                console.log('Usuario autenticado con éxito:', user);
                return { success: true, user: user };
            }
        }
        console.log('Autenticación fallida, datos recibidos:', data);
        return { success: false };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: error };
    }
};