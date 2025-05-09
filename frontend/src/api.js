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

export const createColumnAxios = async (columnName) => {
    try {
        const response = await axiosInstance.post('/columns', { name: columnName });
        return response.data;
    } catch (error) {
        console.error('Error creating column via API:', error);
        throw error;
    }
};

export const createCardAxios = async (cardDataWithColumnId) => {
    const response = await axiosInstance.post('/cards', cardDataWithColumnId);
    return response.data;
};

export const updateCardAxios = async (cardId, updatedCardData) => {
    const response = await axiosInstance.put(`/cards/${cardId}`, updatedCardData);
    return response.data;
}

export const deleteCardAxios = async (cardId) => {
    await axiosInstance.delete(`/cards/${cardId}`);
};

export const deleteColumnAxios = async (columnId) => {
    try {
        await axiosInstance.delete(`/columns/${columnId}`);
        console.log(`Column ${columnId} deleted successfully via API.`);
    } catch (error) {
        console.error(`Error deleting column ${columnId} via API:`, error);
        throw error;
    }
};

export const moveCardAxios = async (cardId, newColumnId) => {
    const response = await axiosInstance.put(`/cards/${cardId}/move/${newColumnId}`);
    return response.data;
};