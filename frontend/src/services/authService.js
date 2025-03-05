import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('jwt', response.data.token);
    }
    return response.data;
};

export const signup = async (username, email, password) => {
    const response = await axios.post(`${API_URL}/signup`, { username, email, password });
    if (response.data.token) {
        localStorage.setItem('jwt', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('jwt');
};
