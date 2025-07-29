import React, { useState, useEffect } from 'react';
import '../styles/Auth.css';
import ArenaLogo from '../assets/Logo-Arena.png';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface FormData {
  fullName: string;
  email: string;
  password: string;
}

interface AuthProps {
  onLoginSuccess?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    setServerError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'ФИО обязательно для заполнения';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email адрес';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (validateForm()) {
      try {
        if (isLogin) {
          // Login
          const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка входа');
          }

          const data = await response.json();
          // Сохраняем refresh_token
          localStorage.setItem('refresh_token', data.refresh_token);
          // Вызываем callback для уведомления родительского компонента
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else {
          // Registration
          const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              full_name: formData.fullName,
              email: formData.email,
              password: formData.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка регистрации');
          }

          const data = await response.json();
          setIsSubmitted(true);
        }
      } catch (error) {
        setServerError(error instanceof Error ? error.message : 'Произошла ошибка');
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-box success-message">
          <img src={ArenaLogo} alt="ARENA Logo" className="logo-img" />
          <p className="app-title">ТВ Калькулятор</p>
          <h2>Заявка отправлена!</h2>
          <p>
            Спасибо за вашу заявку на регистрацию. Мы рассмотрим её в ближайшее время.
            После одобрения заявки администратором, вы получите письмо на указанный email
            с дальнейшими инструкциями по активации вашего аккаунта.
          </p>
          <button
            type="button"
            className="submit-button"
            onClick={() => {
              setIsLogin(true);
              setIsSubmitted(false);
            }}
          >
            Вернуться к входу
          </button>
        </div>
      </div>
    );
  }

  if (showReset) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <img src={ArenaLogo} alt="ARENA Logo" className="logo-img" />
          <p className="app-title">ТВ Калькулятор</p>
          <h2 className="auth-form-title">Восстановление пароля</h2>
          {resetMessage && <div className="success-message">{resetMessage}</div>}
          {resetError && <div className="error-message">{resetError}</div>}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setResetError(null);
              setResetMessage(null);
              setResetLoading(true);
              if (!validateEmail(resetEmail)) {
                setResetError('Введите корректный email адрес');
                setResetLoading(false);
                return;
              }
              try {
                const response = await fetch(`${API_URL}/api/password-reset-request`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: resetEmail }),
                });
                if (!response.ok) {
                  throw new Error('Ошибка отправки запроса');
                }
                setResetMessage('Если email зарегистрирован, инструкция отправлена');
              } catch (err) {
                setResetError('Ошибка отправки запроса');
              } finally {
                setResetLoading(false);
              }
            }}
          >
            <div className="form-group">
              <label htmlFor="resetEmail">Email</label>
              <input
                type="email"
                id="resetEmail"
                name="resetEmail"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                placeholder="Введите ваш email"
                disabled={resetLoading}
              />
            </div>
            <button type="submit" className="submit-button" disabled={resetLoading}>
              {resetLoading ? 'Отправляем...' : 'Восстановить'}
            </button>
          </form>
          <div className="switch-form">
            <button type="button" className="switch-button" onClick={() => setShowReset(false)}>
              Назад к входу
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src={ArenaLogo} alt="ARENA Logo" className="logo-img" />
        <p className="app-title">ТВ Калькулятор</p>
        <h2 className="auth-form-title">{isLogin ? 'Вход' : 'Заявка на регистрацию'}</h2>
        {!isLogin && (
          <p className="registration-info">
            Заполните форму для подачи заявки на регистрацию. После рассмотрения заявки
            администратором, вы получите письмо на указанный email с дальнейшими
            инструкциями.
          </p>
        )}
        {serverError && <div className="error-message">{serverError}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="fullName">ФИО</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Введите ваше ФИО"
                />
                {errors.fullName && <span className="error">{errors.fullName}</span>}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Введите ваш email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Введите пароль"
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          {isLogin && (
            <div style={{ textAlign: 'right', marginBottom: 10 }}>
              <button
                type="button"
                className="link-button"
                style={{ background: 'none', border: 'none', color: '#2980b9', cursor: 'pointer', padding: 0, fontSize: 14 }}
                onClick={() => setShowReset(true)}
              >
                Забыли пароль?
              </button>
            </div>
          )}

          <button type="submit" className="submit-button">
            {isLogin ? 'Войти' : 'Отправить заявку'}
          </button>
        </form>

        <div className="switch-form">
          <button
            type="button"
            className="switch-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? 'Нет аккаунта? Подать заявку на регистрацию'
              : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth; 