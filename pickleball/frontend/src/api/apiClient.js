import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // URL của Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;