import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const ResetPasswordForm = ({ onSubmit, onLoginClick, loading }) => {
  const [resetEmail, setResetEmail] = useState('');
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(resetEmail)) {
      return { error: 'Please enter a valid email address' };
    }
    
    onSubmit(resetEmail);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="p-fluid">
        <div className="field">
          <label htmlFor="reset-email">Email</label>
          <InputText 
            id="reset-email" 
            value={resetEmail} 
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          <small>Enter the email address associated with your account</small>
        </div>
        
        <div className="field">
          <Button 
            label="Reset Password" 
            icon="pi pi-replay" 
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

export default ResetPasswordForm;