// apiService.js
const BASE_URL = 'http://suvalsa-home.ddns.net:8030/api';

const fetchPostInicioDia = async (data) => {
    const url = `${BASE_URL}/checadorUsuarios`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Respuesta del servidor no fue exitosa: ' + response.status);
    }
    return response.status;  // Devuelve el estado HTTP de la respuesta
};

export { fetchPostInicioDia };
