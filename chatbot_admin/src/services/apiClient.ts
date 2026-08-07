import axios from 'axios';

const SERVER_IP = '127.0.0.1';
const SERVER_PORT = '5005';
const BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

function attachAuthToken(client: ReturnType<typeof axios.create>) {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('nova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('nova_token');
        localStorage.removeItem('nova_user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  );
}

export const loginApiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, 
});
attachAuthToken(loginApiClient);

export const ingestApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});
attachAuthToken(ingestApiClient);