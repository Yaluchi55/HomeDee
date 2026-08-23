import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL = 'https://dwello-sigma.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the saved JWT token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Real endpoints recovered from the compiled app bundle:
//   POST /api/login
//   POST /api/signup
//   GET  /auth-status
//   GET  /profile
//   PUT  /updateProfile
//   GET  /houses/similar/:id
//   POST /images/upload
//   POST /api/listings/submitListing
//   GET  /api/my-guests   (landlord's confirmed/pending bookings)
// Endpoints not recovered (houses list, single house, messaging, etc.)
// are still best-guess REST paths — verify against your backend.

export default api;
