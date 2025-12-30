import axios, { AxiosError } from 'axios';

export const api = axios.create({
    // Matches the app.setGlobalPrefix('api') in main.ts
    baseURL: 'http://127.0.0.1:3000/api',
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    console.log(`📡 SENDING: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
});

api.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError<any>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.error(`❌ API ERROR [${status}]:`, message);

        return Promise.reject({
            status,
            message: Array.isArray(message) ? message[0] : message,
            original: error
        });
    }
);