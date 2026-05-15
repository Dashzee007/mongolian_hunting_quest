/**
 * API Configuration
 * Centralized API URL management for easy environment switching
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ANIMALS: `${API_BASE_URL}/api/animals`,
  BOOKINGS: `${API_BASE_URL}/api/bookings`,
}

export default API_ENDPOINTS
