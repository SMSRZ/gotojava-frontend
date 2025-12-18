import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopicList from './components/TopicList';
import QuestionList from './components/QuestionList';
import AIHelper from './components/AIHelper';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import authService from './services/authService';
import './App.css';

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);

const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status using authService
    setIsAuthenticated(authService.isAuthenticated());
    
    // Set up token expiry check interval (check every minute)
    const tokenCheckInterval = setInterval(() => {
      if (authService.isTokenExpired()) {
        setIsAuthenticated(false);
        authService.logout();
      } else {
        authService.checkAndRefreshToken();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(tokenCheckInterval);
  }, []);

  const handleAuthOpen = () => {
    setIsAuthOpen(true);
  };

  const handleAuthClose = () => {
    setIsAuthOpen(false);
  };

  const handleAuthSuccess = (token) => {
    setIsAuthenticated(true);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedTopic(null);
  };

  const handleTopicSelect = (topic) => {
    if (!isAuthenticated) {
      handleAuthOpen();
    } else {
      setSelectedTopic(topic);
    }
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="App">
<AuthModal isOpen={isAuthOpen} onClose={handleAuthClose} onAuthSuccess={handleAuthSuccess} />
      <AIHelper />
      <motion.header 
        className="App-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <div className="header-text">
            <motion.h1 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Java Interview Prep
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Master Java concepts with comprehensive interview questions
            </motion.p>
          </div>
          
          {isAuthenticated && (
            <motion.div 
              className="header-actions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <UserProfile onLogout={handleLogout} />
            </motion.div>
          )}
        </div>
      </motion.header>
      
      <main className="App-main">
        <AnimatePresence mode="wait">
          {selectedTopic ? (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <QuestionList 
                selectedTopic={selectedTopic} 
                onBackToTopics={handleBackToTopics} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="topics"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <TopicList onTopicSelect={handleTopicSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <motion.footer 
        className="App-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p>&copy; Built with React</p>
        <div className="footer-contact">
          <p className="creator-name">Created by Mohd Safi Raza</p>
          <div className="contact-links">
            <a href="https://linkedin.com/in/safi-raza-795427253" className="contact-link linkedin" target="_blank" rel="noopener noreferrer">
              <span className="icon">💼</span>
              LinkedIn
            </a>
            <a href="mailto:safiraza004@gmail.com" className="contact-link email" target="_blank" rel="noopener noreferrer">
              <span className="icon">📧</span>
              Email
            </a>
            <a href="https://github.com/smsrz" className="contact-link github" target="_blank" rel="noopener noreferrer">
              <span className="icon">🔗</span>
              GitHub
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;
