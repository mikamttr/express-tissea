import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
};

export const getLinesByCategory = async (categoryId) => {
    const response = await axios.get(`${API_URL}/categories/${categoryId}/lines`);
    return response.data;
};

export const getStopsByLine = async (categoryId, lineId) => {
    const response = await axios.get(`${API_URL}/categories/${categoryId}/lines/${lineId}/stops`);
    return response.data.map(stop => ({
        name: stop.name,
        latitude: stop.latitude,
        longitude: stop.longitude
    }));
};