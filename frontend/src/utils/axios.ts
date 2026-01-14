import axios, { type InternalAxiosRequestConfig } from "axios";

// Création de l'instance Axios
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor pour ajouter le token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      // ✅ On modifie les headers existants
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config; // Il faut **retourner le config original**, pas un nouvel objet
  },
  (error) => Promise.reject(error)
);

export default api;
