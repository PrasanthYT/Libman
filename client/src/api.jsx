import axios from "axios";

const API_URL = "https://libman-production.up.railway.app/api";

// Get Token from Local Storage
const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth API Calls
export const registerUser = (data) => axios.post(`${API_URL}/auth/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/auth/login`, data);

// Fetch Pending Issuance
export const getPendingIssuance = async () => {
  const response = await axios.get(`${API_URL}/issuance/pending`, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  return response.data;
};
