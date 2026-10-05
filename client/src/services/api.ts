import axios from 'axios';
import type { Destination, Journey, Simulation, PassportEntry, Memory, TravelRoom, User } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traveltwin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (data: any) => api.post<{ success: boolean; token: string; user: User }>('/auth/login', data),
  register: (data: any) => api.post<{ success: boolean; token: string; user: User }>('/auth/register', data),
  getMe: () => api.get<{ success: boolean; user: User }>('/auth/me'),
  updateProfile: (data: any) => api.put<{ success: boolean; user: User; message: string }>('/auth/profile', data),
  resetTravelTwin: () => api.post<{ success: boolean; user: User; message: string }>('/auth/reset-twin'),
};

export const destinationApi = {
  getAll: (params?: { search?: string; category?: string; state?: string; featured?: boolean }) =>
    api.get<{ success: boolean; count: number; destinations: Destination[] }>('/destinations', { params }),
  getById: (id: string) => api.get<{ success: boolean; destination: Destination }>(`/destinations/${id}`),
  create: (data: any) => api.post<{ success: boolean; destination: Destination }>('/destinations', data),
  update: (id: string, data: any) => api.put<{ success: boolean; destination: Destination }>(`/destinations/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/destinations/${id}`),
};

export const journeyApi = {
  start: (data: { destinationId: string; mode?: string; preferences?: string[]; comfortMode?: string; stops?: any[]; activities?: any[] }) =>
    api.post<{ success: boolean; journey: Journey; message: string }>('/journeys', data),
  getAll: () => api.get<{ success: boolean; count: number; journeys: Journey[] }>('/journeys'),
  getById: (id: string) => api.get<{ success: boolean; journey: Journey }>(`/journeys/${id}`),
  complete: (id: string, data?: { activityScores?: any; stopsCompleted?: string[] }) =>
    api.put<{ success: boolean; journey: Journey; xpAwarded: number; levelUp: boolean; newLevel?: number; passportEntry?: PassportEntry }>(`/journeys/${id}/complete`, data),
};

export const simulationApi = {
  create: (data: any) => api.post<{ success: boolean; simulation: Simulation; message: string }>('/simulations', data),
  getAll: () => api.get<{ success: boolean; count: number; simulations: Simulation[] }>('/simulations'),
  getById: (id: string) => api.get<{ success: boolean; simulation: Simulation }>(`/simulations/${id}`),
};

export const aiApi = {
  travelTwinDirector: (data: { destination: string; mood: string; preferences: string[]; comfortMode?: string; duration?: string }) =>
    api.post<{ success: boolean; journey: any }>('/ai/travel-twin', data),
  destinationGuide: (data: { destination: string; question: string; currentAttraction?: string; userAccessibilityNeeds?: string[] }) =>
    api.post<{ success: boolean; answer: string }>('/ai/destination-guide', data),
  travelPlan: (data: any) => api.post<{ success: boolean; plan: any }>('/ai/travel-plan', data),
};

export const passportApi = {
  getPassport: () => api.get<{ success: boolean; passport: any }>('/passport'),
  unlockStamp: (destinationId: string) => api.post<{ success: boolean; entry: PassportEntry; xpEarned: number; currentXp: number; currentLevel: number }>('/passport/unlock', { destinationId }),
};

export const memoryApi = {
  getAll: () => api.get<{ success: boolean; count: number; memories: Memory[] }>('/memories'),
  create: (data: { destinationId: string; imageUrl: string; caption: string; sceneName?: string; tags?: string[] }) =>
    api.post<{ success: boolean; memory: Memory; message: string }>('/memories', data),
  delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/memories/${id}`),
};

export const roomApi = {
  create: (destinationId: string) => api.post<{ success: boolean; room: TravelRoom; message: string }>('/rooms', { destinationId }),
  join: (roomCode: string) => api.post<{ success: boolean; room: TravelRoom; message: string }>('/rooms/join', { roomCode }),
  getByCode: (code: string) => api.get<{ success: boolean; room: TravelRoom }>(`/rooms/${code}`),
};

export const adminApi = {
  getStats: () => api.get<{ success: boolean; stats: any }>('/admin/stats'),
  getUsers: () => api.get<{ success: boolean; count: number; users: User[] }>('/admin/users'),
};

export default api;
