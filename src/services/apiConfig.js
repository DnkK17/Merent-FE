import axios from "axios";

export const api = axios.create({
    baseURL: "https://merent.uydev.id.vn/api"
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  export default api;