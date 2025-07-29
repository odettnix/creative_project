import { API_CONFIG, UserProfile, ProfileUpdateData, ApiResponse } from './config';
import { fetchWithAuth } from '../utils/auth';

class ProfileService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Получить профиль текущего пользователя
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}${API_CONFIG.ENDPOINTS.PROFILE.GET_PROFILE}`);
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке профиля');
      }

      const data = await response.json();
      
      // Проверяем, есть ли поле success в ответе
      if (data.success === false) {
        throw new Error(data.error || 'Ошибка при загрузке профиля');
      }

      // Если нет поля success, считаем что данные пришли напрямую
      return data.success ? data.data : data;
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
      throw error;
    }
  }

  /**
   * Обновить профиль пользователя
   */
  async updateProfile(profileData: ProfileUpdateData): Promise<UserProfile> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}${API_CONFIG.ENDPOINTS.PROFILE.UPDATE_PROFILE}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении профиля');
      }

      const data = await response.json();
      
      // Проверяем, есть ли поле success в ответе
      if (data.success === false) {
        throw new Error(data.error || 'Ошибка при обновлении профиля');
      }

      // Если нет поля success, считаем что данные пришли напрямую
      return data.success ? data.data : data;
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      throw error;
    }
  }

  /**
   * Изменить пароль пользователя
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при смене пароля');
      }

      const data: ApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Ошибка при смене пароля');
      }
    } catch (error) {
      console.error('Ошибка при смене пароля:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService(); 