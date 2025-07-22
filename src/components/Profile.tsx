import React, { useState } from 'react';
import './Profile.css';
import { User, Edit, LogOut, Save, X } from 'lucide-react';

const initialProfile = {
  fullname: 'Иван Иванов',
  email: 'ivan.ivanov@email.com',
  role: 'Администратор',
};

const Profile: React.FC<{ sidebarCollapsed?: boolean }> = ({ sidebarCollapsed = false }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);

  const handleEdit = () => {
    setDraft(profile);
    setEditMode(true);
  };
  const handleCancel = () => setEditMode(false);
  const handleSave = () => {
    setProfile(draft);
    setEditMode(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft({ ...draft, [e.target.name]: e.target.value });
  };
  const handleLogout = () => {
    // Здесь может быть реальный logout
    alert('Выход из аккаунта');
  };

  return (
    <div className={`profile-page${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <div className="profile-card-full">
        <div className="profile-avatar-xxl">
          <User size={80} />
        </div>
        <div className="profile-main-info">
          {editMode ? (
            <>
              <input
                className="profile-input"
                name="fullname"
                value={draft.fullname}
                onChange={handleChange}
                placeholder="ФИО"
                autoFocus
              />
              <input
                className="profile-input"
                name="email"
                value={draft.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
              />
              <input
                className="profile-input"
                name="role"
                value={draft.role}
                onChange={handleChange}
                placeholder="Роль"
              />
            </>
          ) : (
            <>
              <h1 className="profile-fullname">{profile.fullname}</h1>
              <div className="profile-email">{profile.email}</div>
              <div className="profile-role">Роль: {profile.role}</div>
            </>
          )}
        </div>
        {editMode ? (
          <div className="profile-edit-actions">
            <button className="profile-save-btn" onClick={handleSave}><Save size={18}/> Сохранить</button>
            <button className="profile-cancel-btn" onClick={handleCancel}><X size={18}/> Отмена</button>
          </div>
        ) : (
          <button className="profile-edit-btn" onClick={handleEdit}><Edit size={18}/> Редактировать</button>
        )}
      </div>
      <button className="profile-logout-btn" onClick={handleLogout}><LogOut size={20}/> Выйти</button>
    </div>
  );
};

export default Profile; 