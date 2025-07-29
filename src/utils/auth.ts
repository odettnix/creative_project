import { API_URL } from '../config';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    throw new Error('No refresh token available');
  }
  try {
    const response = await fetch(`${API_URL}/api/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ refresh_token }),
    });
    if (!response.ok) {
      localStorage.removeItem('refresh_token');
      throw new Error('Failed to refresh token');
    }
    const data = await response.json();
    localStorage.setItem('refresh_token', data.refresh_token);
    return true;
  } catch (error) {
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });

    if (response.status === 401 && !isRefreshing) {
      isRefreshing = true;

      try {
        await refreshToken();
        isRefreshing = false;
        processQueue();
        
        // Повторяем запрос с обновленным токеном
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      } catch (error) {
        processQueue(error);
        throw error;
      }
    }

    if (response.status === 401 && isRefreshing) {
      // Если токен уже обновляется, добавляем запрос в очередь
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => fetch(url, { ...options, credentials: 'include' }))
        .catch((err) => Promise.reject(err));
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}; 