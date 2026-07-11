// Single source of truth for the backend origin.
// Override in production via a Vite env var: VITE_API_URL=https://api.example.com
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
