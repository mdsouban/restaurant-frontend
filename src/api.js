import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:10000",
  timeout: 10000,
});

// Menu Operations
export const menuApi = {
  getAll: async () => {
    const response = await api.get('/api/menu');
    return response.data;
  },

  add: async (item) => {
    const response = await api.post('/api/menu', item);
    return response.data;
  },

  update: async (id, item) => {
    const response = await api.put(`/api/menu/${id}`, item);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/menu/${id}`);
    return response.data;
  }
};

// Bill Operations
export const billApi = {
  create: async (mobile, items, total) => {
    const response = await api.post('/api/bill', { mobile, items, total });
    return response.data.invoiceId;
  },

  getById: async (id) => {
    const response = await api.get(`/api/bill/${id}`);
    return response.data;
  },

  getReport: async (date) => {
    // This would need to be implemented in your backend
    const response = await api.get(`/api/reports?date=${date}`);
    return response.data;
  }
};

export default api;