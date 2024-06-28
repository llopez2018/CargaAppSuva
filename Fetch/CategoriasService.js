export const BASE_URL = 'http://suvalsa-home.ddns.net:8070/';

export const createEntity = async (path, data) => {
    try {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error text:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Server response:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error creating entity:', error);
        throw error;
    }
};

export default createEntity;
