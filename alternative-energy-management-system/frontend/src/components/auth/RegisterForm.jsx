import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';

const RegisterForm = ({ onSubmit, onLoginClick, loading }) => {
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: ''
  });
  
  const locationOptions = [
    { label: 'Damascus, Syria', value: 'Damascus, Syria' },
    { label: 'Aleppo, Syria', value: 'Aleppo, Syria' },
    { label: 'Homs, Syria', value: 'Homs, Syria' },
    { label: 'Hama, Syria', value: 'Hama, Syria' },
    { label: 'Latakia, Syria', value: 'Latakia, Syria' },
    { label: 'Tartus, Syria', value: 'Tartus, Syria' },
    { label: 'Idlib, Syria', value: 'Idlib, Syria' },
    { label: 'Deir ez-Zor, Syria', value: 'Deir ez-Zor, Syria' },
    { label: 'Raqqa, Syria', value: 'Raqqa, Syria' },
    { label: 'Al-Hasakah, Syria', value: 'Al-Hasakah, Syria' },
    { label: 'Daraa, Syria', value: 'Daraa, Syria' },
    { label: 'As-Suwayda, Syria', value: 'As-Suwayda, Syria' },
    { label: 'Quneitra, Syria', value: 'Quneitra, Syria' },
    { label: 'Rif Dimashq, Syria', value: 'Rif Dimashq, Syria' }
  ];
  
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!registerData.name.trim()) {
      return { error: 'Name is required' };
    }
    
    if (!validateEmail(registerData.email)) {
      return { error: 'Please enter a valid email address' };
    }
    
    if (!validatePassword(registerData.password)) {
      return { error: 'Password must have at least 8 characters, including uppercase, lowercase, and a number' };
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      return { error: 'Passwords do not match' };
    }
    
    if (!registerData.location) {
      return { error: 'Location is required' };
    }
    
    onSubmit(registerData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="p-fluid">
        <div className="field">
          <label htmlFor="name">Full Name</label>
          <InputText 
            id="name" 
            value={registerData.name} 
            onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
            required
          />
        </div>
        
        <div className="field">
          <label htmlFor="register-email">Email</label>
          <InputText 
            id="register-email" 
            value={registerData.email} 
            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
            required
          />
        </div>
        
        <div className="field">
          <label htmlFor="register-password">Password</label>
          <Password 
            id="register-password" 
            value={registerData.password} 
            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
            toggleMask
            promptLabel="Choose a password"
            weakLabel="Too simple"
            mediumLabel="Average complexity"
            strongLabel="Complex password"
            required
          />
          <small className="p-info">
            Password must have at least 8 characters, including uppercase, lowercase, and a number
          </small>
        </div>
        
        <div className="field">
          <label htmlFor="confirm-password">Confirm Password</label>
          <Password 
            id="confirm-password" 
            value={registerData.confirmPassword} 
            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
            toggleMask
            feedback={false}
            required
          />
        </div>
        
        <div className="field">
          <label htmlFor="location">Location</label>
          <Dropdown
            id="location"
            value={registerData.location}
            options={locationOptions}
            onChange={(e) => setRegisterData({...registerData, location: e.value})}
            placeholder="Select a location"
            required
            className="w-full"
          />
          <small>Your location helps us calculate solar energy production potential</small>
        </div>
        
        <div className="field">
          <Button 
            label="Register" 
            icon="pi pi-user-plus" 
            className="w-full" 
            loading={loading}
            type="submit"
          />
        </div>
        
        <div className="field">
          <Button 
            label="Back to Login" 
            className="p-button-text w-full" 
            onClick={onLoginClick}
            type="button"
          />
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;