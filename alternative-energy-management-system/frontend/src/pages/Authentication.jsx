import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const Authentication = ({ onLogin }) => {
  const navigate = useNavigate();
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleLogin = async (loginData) => {
    setError('');
    setLoading(true);
    
    try {
      const user = await authService.login(loginData.email, loginData.password);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin && onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (registerData) => {
    setError('');
    setLoading(true);
    
    try {
      await authService.register(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.location
      );
      setSuccess('Registration successful! You can now login.');
      setView('login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (email) => {
    setError('');
    setLoading(true);
    
    try {
      await authService.resetPassword(email);
      setSuccess('Password reset email sent. Check your inbox.');
      setTimeout(() => setView('login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const switchView = (newView) => {
    setView(newView);
    setError('');
    setSuccess('');
  };
  
  const getHeader = () => {
    switch (view) {
      case 'register':
        return 'Create Account';
      case 'reset':
        return 'Reset Password';
      default:
        return 'Login';
    }
  };
  
  return (
    <div className="flex align-items-center justify-content-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
      <Card title={getHeader()} style={{ width: '400px' }} className="shadow-4">
        {error && <Message severity="error" text={error} className="w-full mb-3" />}
        {success && <Message severity="success" text={success} className="w-full mb-3" />}
        
        {view === 'login' && (
          <LoginForm 
            onSubmit={handleLogin} 
            onRegisterClick={() => switchView('register')}
            onResetClick={() => switchView('reset')}
            loading={loading}
          />
        )}
        
        {view === 'register' && (
          <RegisterForm
            onSubmit={handleRegister}
            onLoginClick={() => switchView('login')}
            loading={loading}
          />
        )}
        
        {view === 'reset' && (
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            onLoginClick={() => switchView('login')}
            loading={loading}
          />
        )}
      </Card>
    </div>
  );
};

export default Authentication;