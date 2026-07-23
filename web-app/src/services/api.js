/**
 * PrepWiseAI — Frontend API Client
 * Centralized wrapper for fetch() requests to the backend.
 * Handles JWT injection automatically.
 */

import { Capacitor } from '@capacitor/core';

const API_BASE_URL = Capacitor.isNativePlatform() ? 'http://10.0.2.2:3001/api' : '/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('prepwise_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic fetch wrapper with error handling
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const fetchOptions = {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers }
  };

  const response = await fetch(url, fetchOptions);
  
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
}

// ─── AUTHENTICATION API ──────────────────────────────────────

export const authApi = {
  login: (email, password) => 
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    
  register: (name, email, password) => 
    fetchApi('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
    
  sendOtp: (phone) => 
    fetchApi('/auth/otp/send', { method: 'POST', body: JSON.stringify({ phone }) }),
    
  verifyOtp: (phone, code) => 
    fetchApi('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ phone, code }) }),
    
  socialLogin: (provider) => 
    fetchApi('/auth/social', { method: 'POST', body: JSON.stringify({ provider }) }),
    
  personaLogin: (email) => 
    fetchApi('/auth/persona', { method: 'POST', body: JSON.stringify({ email }) }),
    
  logout: () => {
    localStorage.removeItem('prepwise_token');
    localStorage.removeItem('prepwise_user');
  },
  
  saveSession: (token, user) => {
    localStorage.setItem('prepwise_token', token);
    localStorage.setItem('prepwise_user', JSON.stringify(user));
  }
};

// ─── USER PROFILE API ────────────────────────────────────────

export const userApi = {
  getProfile: () => fetchApi('/user/profile'),
  updateProfile: (data) => fetchApi('/user/profile', { method: 'PUT', body: JSON.stringify(data) })
};

// ─── INTERVIEWS & ANALYTICS API ──────────────────────────────

export const interviewApi = {
  list: () => fetchApi('/interviews'),
  save: (data) => fetchApi('/interviews', { method: 'POST', body: JSON.stringify(data) })
};

export const analyticsApi = {
  summary: () => fetchApi('/analytics/summary')
};
