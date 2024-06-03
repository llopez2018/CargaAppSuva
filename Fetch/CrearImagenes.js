// apiService.js
const BASE_URL = 'http://suvalsa-home.ddns.net:8070/api';

/**
 * Envía una petición POST para crear una imagen en el servidor.
 * @param {Object} data - Los datos a enviar en el cuerpo de la petición.
 * @returns {number} - El estado HTTP de la respuesta.
 * @throws {Error} - Si la respuesta del servidor no fue exitosa.
 */
const fetchPostCrearImagen = async (data) => {
    const url = `${BASE_URL}/imagenes/suvalsa/crear`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error('Error: ' + response.status + ' - ' + errorMessage);
        }

        return response.status;
    } catch (error) {
        console.error('Error al enviar la petición:', error);
        throw error;
    }
};

export { fetchPostCrearImagen };
