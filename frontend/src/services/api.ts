import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Supabase JWT token to requests
api.interceptors.request.use(
  async (config) => {
    // Get current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We can also add a response interceptor to handle token expiration/401 errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle specific API errors
    if (error.response && error.response.status === 401) {
      // Token might be expired or invalid, we could optionally force logout here
      // But we will let AuthContext handle session expiry natively via onAuthStateChange
    }
    return Promise.reject(error);
  }
);

export default api;
