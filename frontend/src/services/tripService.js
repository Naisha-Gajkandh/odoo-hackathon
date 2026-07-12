import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login/', { email, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_role', response.data.role || 'Dispatcher');
      localStorage.setItem('user_email', email);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
  },
  getCurrentRole: () => {
    return localStorage.getItem('user_role') || null;
  },
  getCurrentEmail: () => {
    return localStorage.getItem('user_email') || null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};

export const tripService = {
  getTrips: async (statusFilter = '') => {
    const params = {};
    if (statusFilter && statusFilter !== 'ALL') {
      params.status = statusFilter;
    }
    const response = await apiClient.get('/api/trips/', { params });
    return response.data;
  },
  getTrip: async (id) => {
    const response = await apiClient.get(`/api/trips/${id}/`);
    return response.data;
  },
  createTrip: async (data) => {
    // Body parameters: source, destination, vehicle (ID), driver (ID), cargo_weight_kg, planned_distance_km
    const response = await apiClient.post('/api/trips/', {
      source: data.source,
      destination: data.destination,
      vehicle: parseInt(data.vehicle),
      driver: parseInt(data.driver),
      cargo_weight_kg: parseFloat(data.cargo_weight_kg),
      planned_distance_km: parseFloat(data.planned_distance_km || 100),
    });
    return response.data;
  },
  dispatchTrip: async (id) => {
    const response = await apiClient.post(`/api/trips/${id}/dispatch/`);
    return response.data;
  },
  completeTrip: async (id, finalOdometer, fuelConsumedLiters) => {
    const response = await apiClient.post(`/api/trips/${id}/complete/`, {
      final_odometer: parseInt(finalOdometer),
      fuel_consumed_liters: parseFloat(fuelConsumedLiters),
    });
    return response.data;
  },
  cancelTrip: async (id) => {
    const response = await apiClient.post(`/api/trips/${id}/cancel/`);
    return response.data;
  },
  getTripEta: async (id) => {
    const response = await apiClient.get(`/api/trips/${id}/eta/`);
    return response.data;
  },
};

export const vehicleService = {
  getAvailableVehicles: async () => {
    const response = await apiClient.get('/api/fleet/vehicles/dispatchable/');
    return response.data;
  },
  getAllVehicles: async () => {
    const response = await apiClient.get('/api/fleet/vehicles/');
    return response.data;
  },
  createVehicle: async (data) => {
    const response = await apiClient.post('/api/fleet/vehicles/', data);
    return response.data;
  },
  getVehicleDetails: async (id) => {
    const response = await apiClient.get(`/api/fleet/vehicles/${id}/`);
    return response.data;
  },
  retireVehicle: async (id) => {
    const response = await apiClient.post(`/api/fleet/vehicles/${id}/retire/`);
    return response.data;
  }
};

export const driverService = {
  getAvailableDrivers: async () => {
    const response = await apiClient.get('/api/drivers/assignable/');
    return response.data;
  },
};

export default apiClient;
