const API_BASE_URL = 'http://localhost:8080/api';

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

export const fetchColumnsAxios = async () => {
    const response = await axiosInstance.get('/columns');
    return response.data;
};

// --- ADDED: Function to create a new column ---
export const createColumnAxios = async (columnName) => {
    try {
        // Make a POST request to the /api/columns endpoint
        // Send the column name in the request body as a JSON object { "name": "..." }
        const response = await axiosInstance.post('/columns', { name: columnName });
        // Return the data from the response (should be the created column object)
        return response.data;
    } catch (error) {
        console.error('Error creating column via API:', error);
        throw error; // Re-throw the error so the calling component can handle it
    }
};
// --- END ADDED ---


export const createCardAxios = async (cardDataWithColumnId) => {
    const response = await axiosInstance.post('/cards', cardDataWithColumnId);
    return response.data;
};

export const updateCardAxios = async (cardId, updatedCardData) => {
    const response = await axiosInstance.put(`/cards/${cardId}`, updatedCardData);
    return response.data;
}

export const deleteCardAxios = async (cardId) => {
    // Axios automatically rejects the promise on 404, 500 etc.
    await axiosInstance.delete(`/cards/${cardId}`);
    // No return value expected for delete
};

export const moveCardAxios = async (cardId, newColumnId) => {
    // This endpoint uses URL parameters for cardId and newColumnId
    // No request body is needed for this specific PUT endpoint design
    const response = await axiosInstance.put(`/cards/${cardId}/move/${newColumnId}`);
    return response.data;
};