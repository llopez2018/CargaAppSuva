// RutasCarga.js
export const fetchRutasNombre = async () => {
    try {
        const response = await fetch('http://suvalsa-home.ddns.net:8070/api/viajes/rutas-nombre');
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        const data = await response.json();
        return data.map(ruta => ({
            id: ruta.id,
            nombre: `${ruta.viajeRuta} - ${ruta.rutaNombre}`,
            Rfecha: ruta.fecha,
        }));
    } catch (error) {
        console.error('Error fetching rutas:', error);
        throw error;
    }
};
