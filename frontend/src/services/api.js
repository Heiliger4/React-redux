import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error - please check your connection",
        status: "NETWORK_ERROR",
      });
    }
    const { status, data } = error.response;
    return Promise.reject({
      message: data?.error || `HTTP ${status} Error`,
      status,
      response: error.response,
    });
  }
);

export const songsApi = {
  fetchSongs: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    return apiClient.get(`/songs?${queryParams.toString()}`);
  },
  createSong: (songData) => apiClient.post("/songs", songData),
  updateSong: (id, songData) => apiClient.put(`/songs/${id}`, songData),
  deleteSong: (id) => apiClient.delete(`/songs/${id}`),
};

export default apiClient;
