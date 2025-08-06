import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("devlink_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("devlink_token");
      localStorage.removeItem("devlink_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/profile"),
};

export const resourceAPI = {
  getResources: (params) => api.get("/resources/", { params }),
  createResource: (data) => api.post("/resources/", data),
  updateResource: (id, data) => api.put(`/resources/${id}/`, data),
  deleteResource: (id) => api.delete(`/resources/${id}/`),
  getPublicResources: (params) => api.get("/resources/public", { params }),
  clickResource: (id) => api.post(`/resources/${id}/click`),
};

export default api;