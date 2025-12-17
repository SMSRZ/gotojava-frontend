import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, RefreshCw, AlertCircle, ChevronRight } from 'lucide-react';
import axios from 'axios';
import './TopicList.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const TopicList = ({ onTopicSelect }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);
  
  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/getAllTopics`);
      console.log(response.data);
      setTopics(response.data);
    } catch (err) {
      setError('Failed to fetch topics. Please check if the backend server is running.');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTopics();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleTopicClick = (topic) => {
    onTopicSelect(topic);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <motion.div 
        className="topic-list-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="loading-container">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="loading-spinner"
          />
          <p>Loading topics...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="topic-list-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error-container">
          <AlertCircle className="error-icon" />
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <motion.button 
            onClick={fetchTopics}
            className="retry-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="topic-list-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-section">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Choose a Topic
        </motion.h2>
        <motion.button
          onClick={handleRefresh}
          className="refresh-button"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          disabled={refreshing}
        >
          <RefreshCw className={`refresh-icon ${refreshing ? 'spinning' : ''}`} />
        </motion.button>
      </div>

      <motion.div 
        className="topics-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              className="topic-card"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTopicClick(topic)}
              layout
            >
              <div className="topic-content">
                <BookOpen className="topic-icon" />
                <h3>{topic.topicName}</h3>
                <p>Click to explore questions</p>
                <ChevronRight className="chevron-icon" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {topics.length === 0 && (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <BookOpen className="empty-icon" />
          <p>No topics available</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TopicList; 