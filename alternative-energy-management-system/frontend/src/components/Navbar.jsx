import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const items = [
    {
      label: 'Solar Energy System',
      icon: 'pi pi-home',
      command: () => navigate('/dashboard')
    }
  ];
  
  const end = (
    <div className="flex align-items-center gap-2">
      <span className="font-bold mr-3">{user.name || 'User'}</span>
      <Button 
        icon="pi pi-user" 
        className="p-button-rounded p-button-text"
        onClick={() => navigate('/profile')} 
        tooltip="Profile"
        tooltipOptions={{ position: 'bottom' }}
      />
      <Button 
        icon="pi pi-power-off" 
        className="p-button-rounded p-button-danger p-button-text"
        onClick={onLogout}
        tooltip="Logout"
        tooltipOptions={{ position: 'bottom' }}
      />
    </div>
  );
  
  return (
    <div className="navbar">
      <Menubar model={items} end={end} className="shadow-2 border-none" />
    </div>
  );
};

export default Navbar;
