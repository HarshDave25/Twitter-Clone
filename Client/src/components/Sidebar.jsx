import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';
import Image from 'react-bootstrap/Image';
import '../sass/Sidebar.scss';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Image src="/assets/logo.svg" className="sidebar-logo" />
      </div>
      <div className="sidebar-menu">
        <SidebarItem icon={<FaHome />} text="Home" to="/" />
        <SidebarItem icon={<FaUser />} text="Profile" to="/profile" />
        <div className="sidebar-item" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </div>
      <div className="sidebar-footer">
        <SidebarProfile />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, to }) => {
  return (
    <NavLink to={to} className="sidebar-item">
      {icon}
      <span>{text}</span>
    </NavLink>
  );
};

const SidebarProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <div></div>;
  }
  const profilePicUrl = user.profilePic ? `${API_URL}/${user.profilePic}` : "/assets/default_user.jpg";

  return (
    <div className="sidebar-profile">
      <img src={profilePicUrl} alt="Profile" />
      <div className="profile-info">
        <div className="profile-name">{user.name}</div>
        <div className="profile-username">@{user.username}</div>
      </div>
    </div>
  );
};

export default Sidebar;
