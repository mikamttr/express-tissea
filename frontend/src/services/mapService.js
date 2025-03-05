import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const getLinesByCategory = async (categoryId) => {
    const response = await axios.get(`${API_URL}/categories/${categoryId}/lines`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const getStopsByLine = async (categoryId, lineId) => {
    const response = await axios.get(`${API_URL}/categories/${categoryId}/lines/${lineId}/stops`, {
        headers: getAuthHeaders()
    });
    return response.data.map(stop => ({
        name: stop.name,
        latitude: stop.latitude,
        longitude: stop.longitude
    }));
};
