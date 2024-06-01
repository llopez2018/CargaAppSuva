const BASE_URL_NEW = 'http://suvalsa-home.ddns.net:8070/api';

export const fetchGetManifSearch = async (ruta, fecha) => {
    const url = `${BASE_URL_NEW}/manif/with-clients?ruta=${ruta}&fruta=${fecha}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Respuesta del servidor no fue exitosa: ' + response.status);
    }
    return await response.json();  // Devuelve el contenido JSON de la respuesta
};
