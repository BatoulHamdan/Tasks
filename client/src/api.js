import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export const getItems = () => axios.get(`${API_BASE}/api/items`);
export const addItem = (payload) => axios.post(`${API_BASE}/api/items`, payload);
export const updateItem = (id, payload) => axios.put(`${API_BASE}/api/items/${id}`, payload);
export const deleteItem = (id) => axios.delete(`${API_BASE}/api/items/${id}`);

export const getCategories = () => axios.get(`${API_BASE}/api/categories`);
export const addCategory = (payload) => axios.post(`${API_BASE}/api/categories`, payload);