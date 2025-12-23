import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Adding an interceptor to handle data automatically and clear unused var warnings
api.interceptors.response.use(
    (response) => response.data,
    (err) => {
        // Use the error variable to log it, fixing the "defined but never used" warning
        console.error("API Error Response:", err.response?.data || err.message);
        return Promise.reject(err);
    }
);