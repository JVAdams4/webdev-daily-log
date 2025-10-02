import axios from 'axios';
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://us-central1-webdev-daily-work-log.cloudfunctions.net/api'
    : 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) { config.headers['x-auth-token'] = token; }
  return config;
});
export default api;