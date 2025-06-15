import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'primereact/menu';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      className: isActive('/dashboard') ? 'active-menu-item' : '',
      command: () => navigate('/dashboard')
    },
    {
      label: 'Solar Panels',
      icon: 'pi pi-fw pi-sun',
      className: isActive('/panels') ? 'active-menu-item' : '',
      command: () => navigate('/panels')
    },
    {
      label: 'Electrical Devices',
      icon: 'pi pi-fw pi-desktop',
      className: isActive('/devices') ? 'active-menu-item' : '',
      command: () => navigate('/devices')
    },
    {
      label: 'User Profile',
      icon: 'pi pi-fw pi-user',
      className: isActive('/profile') ? 'active-menu-item' : '',
      command: () => navigate('/profile')
    }
  ];
  
  return (
    <div className="sidebar shadow-2" style={{ minWidth: '350px', backgroundColor: '#f8f9fa' }}>
      <div className="p-3">
        <h3 className="text-center">Solar Energy App</h3>
        <Menu model={menuItems} className="w-full border-none" />
      </div>
    </div>
  );
};

export default Sidebar;
