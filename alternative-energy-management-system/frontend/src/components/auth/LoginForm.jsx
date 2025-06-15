import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';

const LoginForm = ({ onSubmit, onRegisterClick, onResetClick, loading }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const validatePassword = (password) => {
    return password.length >= 8;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(loginData.email)) {
      return { error: 'Please enter a valid email address' };
    }
    
    if (!validatePassword(loginData.password)) {
      return { error: 'Password must be at least 8 characters' };
    }
    
    onSubmit(loginData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="p-fluid">
        <div className="field">
          <label htmlFor="email">Email</label>
          <InputText 
            id="email" 
            value={loginData.email} 
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            className="w-full"
          />
        </div>
        
        <div className="field">
          <label htmlFor="password">Password</label>
          <Password 
            id="password" 
            value={loginData.password} 
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            toggleMask
            feedback={false}
            className="w-full"
          />
        </div>
        
        <div className="field">
          <Button 
            label="Login" 
            icon="pi pi-sign-in" 
            className="w-full" 
            loading={loading}
            type="submit"
          />
        </div>
        
        <div className="field flex justify-content-between">
          <Button 
            label="Register" 
            className="p-button-text" 
            onClick={onRegisterClick}
            type="button"
          />
          <Button 
            label="Forgot Password?" 
            className="p-button-text" 
            onClick={onResetClick}
            type="button"
          />
        </div>
      </div>
    </form>
  );
};

export default LoginForm;