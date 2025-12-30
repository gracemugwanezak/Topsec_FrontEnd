import axios, { AxiosError } from 'axios';

export const api = axios.create({
    // Force 127.0.0.1 to avoid potential IPv6 'localhost' resolution issues on Windows
    baseURL: 'http://127.0.0.1:3000',
});

// ADD THIS: Request Logger
api.interceptors.request.use((config) => {
    console.log(`📡 SENDING: ${config.method?.toUpperCase()} to ${config.baseURL}${config.url}`);
    return config;
});

api.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError<any>) => {
        console.error("❌ API ERROR:", error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);