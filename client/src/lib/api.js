import axios from 'axios';
import { API_URL } from './config';

// Shared axios instance. `withCredentials` sends the httpOnly JWT cookie on
// every request, so individual calls don't need to repeat credentials config.
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// If the session expires mid-use, push the user back to the login page
// instead of leaving the app half-broken.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401 && window.location.pathname !== '/login') {
      window.location.replace('/login');
    }
    return Promise.reject(err);
  }
);

export default api;
