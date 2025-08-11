import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Clock, ChevronDown } from 'lucide-react';
import authService from '../services/authService';
import './UserProfile.css';

const UserProfile = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const userEmail = authService.getUserEmail();
  const timeUntilExpiry = authService.getTimeUntilExpiry();

  const handleLogout = () => {
    authService.logout();
    onLogout();
    setIsOpen(false);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    
    if (days > 0) {
      if (remainingHours > 0) {
        return `${days}d ${remainingHours}h`;
      }
      return `${days}d`;
    }
    
    if (remainingMinutes > 0) {
      return `${remainingHours}h ${remainingMinutes}m`;
    }
    
    return `${remainingHours}h`;
  };

  return (
    <div className="user-profile">
      <motion.button
        className="profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="profile-avatar">
          <User size={20} />
        </div>
        <div className="profile-info">
          <span className="profile-email">{userEmail?.split('@')[0]}</span>
          <ChevronDown 
            className={`profile-chevron ${isOpen ? 'open' : ''}`} 
            size={16} 
          />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="profile-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="profile-header">
              <div className="profile-avatar large">
                <User size={24} />
              </div>
              <div className="profile-details">
                <h4>{userEmail}</h4>
                <p>Authenticated User</p>
              </div>
            </div>

            <div className="profile-status">
              <div className="status-item">
                <Clock size={16} />
                <span>Session expires in {formatTime(timeUntilExpiry)}</span>
              </div>
            </div>

            <div className="profile-actions">
              <motion.button
                className="logout-button"
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={16} />
                Sign Out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
