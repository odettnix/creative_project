import React, { useState, useEffect } from 'react';
import './Profile.css';
import { User, Edit, LogOut, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import { profileService, UserProfile, ProfileUpdateData } from '../api';

interface ProfileProps {
  sidebarCollapsed?: boolean;
  onLogout?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ sidebarCollapsed = false, onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [draft, setDraft] = useState<ProfileUpdateData>({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Состояние для смены пароля
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Загрузка профиля
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      setDraft({
        full_name: profileData.full_name,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (profile) {
      setDraft({
        full_name: profile.full_name,
      });
      setShowEditModal(true);
    }
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setError(null);
      
      const updatedProfile = await profileService.updateProfile(draft);
      setProfile(updatedProfile);
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении профиля');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft({ ...draft, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Новые пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError(null);
      
      await profileService.changePassword(passwordData.oldPassword, passwordData.newPassword);
      
      // Очищаем форму
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordChange(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Ошибка при смене пароля');
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  if (loading) {
    return (
      <div className={`profile-page${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className={`profile-page${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <div className="profile-error">
          <p>{error}</p>
          <button onClick={loadProfile} className="profile-retry-btn">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`profile-page${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <div className="profile-error">
          <p>Профиль не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-page${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      {/* Верхняя карточка с профилем */}
      <div className="profile-card-full">
        <div className="profile-avatar-xxl">
          <User size={60} color="#1e293b" />
        </div>
        
        <div className="profile-main-info">
          <h1 className="profile-fullname">{profile.full_name}</h1>
          <div className="profile-email">{profile.email}</div>
          <div className="profile-role">{profile.role.toUpperCase()}</div>
        </div>
      </div>

      {/* Нижняя карточка с табами */}
      <div className="profile-content-section">
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Личная информация
          </button>
          <button 
            className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Безопасность
          </button>
        </div>

        <div className="profile-tab-content">
          {activeTab === 'personal' ? (
            <>
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <span className="profile-info-label">Полное имя</span>
                  <span className="profile-info-value">{profile.full_name}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">{profile.email}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Роль</span>
                  <span className="profile-info-value">{profile.role}</span>
                </div>
              </div>
              
              <button className="profile-edit-profile-btn" onClick={handleEdit}>
                <Edit size={16}/> Редактировать профиль
              </button>
            </>
          ) : (
            <div className="profile-password-section">
              <button 
                className="profile-password-btn" 
                onClick={() => setShowPasswordChange(!showPasswordChange)}
              >
                <Lock size={18}/> Сменить пароль
              </button>

              {showPasswordChange && (
                <form onSubmit={handlePasswordSubmit} className="profile-password-form">
                  <div className="password-input-group">
                    <label>Текущий пароль</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.old ? 'text' : 'password'}
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        placeholder="Введите текущий пароль"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => togglePasswordVisibility('old')}
                      >
                        {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="password-input-group">
                    <label>Новый пароль</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Введите новый пароль"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="password-input-group">
                    <label>Подтвердите новый пароль</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Подтвердите новый пароль"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {passwordError && <div className="password-error-message">{passwordError}</div>}

                  <div className="password-actions">
                    <button 
                      type="submit" 
                      className="password-save-btn"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? 'Сохранение...' : 'Сменить пароль'}
                    </button>
                    <button 
                      type="button" 
                      className="password-cancel-btn"
                      onClick={() => {
                        setShowPasswordChange(false);
                        setPasswordData({
                          oldPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                        setPasswordError(null);
                      }}
                      disabled={passwordLoading}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно редактирования */}
      {showEditModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h3>Редактировать профиль</h3>
              <button className="profile-modal-close" onClick={handleCancel}>
                <X size={20} />
              </button>
            </div>
            
            <div className="profile-modal-content">
              <div className="profile-input-group">
                <label>Полное имя</label>
                <input
                  className="profile-input"
                  name="full_name"
                  value={draft.full_name || ''}
                  onChange={handleChange}
                  placeholder="Введите полное имя"
                  autoFocus
                />
              </div>
              
              {error && <div className="profile-error-message">{error}</div>}
            </div>
            
            <div className="profile-modal-actions">
              <button 
                className="profile-save-btn" 
                onClick={handleSave}
                disabled={saveLoading}
              >
                <Save size={16}/>
                {saveLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button 
                className="profile-cancel-btn" 
                onClick={handleCancel}
                disabled={saveLoading}
              >
                <X size={16}/> Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="profile-logout-btn" onClick={handleLogout}>
        <LogOut size={20}/> Выйти
      </button>
    </div>
  );
};

export default Profile; 