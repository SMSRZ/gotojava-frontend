import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertCircle, HelpCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import './QuestionList.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const QuestionList = ({ selectedTopic, onBackToTopics }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    if (selectedTopic) {
      fetchQuestions(selectedTopic.id);
    }
  }, [selectedTopic]);

  const fetchQuestions = async (topicID) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/getAllQuestions/${topicID}`);
      setQuestions(response.data.questionAnswer || []);
    } catch (err) {
      setError('Failed to fetch questions. Please check if the backend server is running.');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const handleBackClick = () => {
    setQuestions([]);
    setExpandedQuestion(null);
    onBackToTopics();
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
        className="question-list-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="loading-container">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="loading-spinner"
          />
          <p>Loading questions...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="question-list-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error-container">
          <AlertCircle className="error-icon" />
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <div className="error-actions">
            <motion.button 
              onClick={() => fetchQuestions(selectedTopic.id)}
              className="retry-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
            <motion.button 
              onClick={handleBackClick}
              className="back-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="back-icon" />
              Back to Topics
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="question-list-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button 
          onClick={handleBackClick}
          className="back-button"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="back-icon" />
          Back to Topics
        </motion.button>
        <div className="header-content">
          <h2>{selectedTopic?.topicName}</h2>
          <span className="question-count">
            {questions.length} {questions.length === 1 ? 'question' : 'questions'}
          </span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {questions.length === 0 ? (
          <motion.div 
            key="empty"
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <HelpCircle className="empty-icon" />
            <h3>No questions available</h3>
            <p>This topic doesn't have any questions yet.</p>
          </motion.div>
        ) : (
          <motion.div 
            key="questions"
            className="questions-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  className="question-item"
                  variants={itemVariants}
                  layout
                >
                  <motion.div 
                    className="question-header"
                    onClick={() => toggleQuestion(question.id)}
                    whileHover={{ backgroundColor: 'rgba(71, 85, 105, 0.6)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="question-number">
                      <span>{index + 1}</span>
                    </div>
                    <h3 className="question-text">{question.question}</h3>
                    <motion.div
                      className="expand-icon"
                      animate={{ rotate: expandedQuestion === question.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {expandedQuestion === question.id ? <ChevronUp /> : <ChevronDown />}
                    </motion.div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {expandedQuestion === question.id && (
                      <motion.div 
                        className="answer-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="answer">
                          <div className="answer-header">
                            <CheckCircle className="answer-icon" />
                            <h4>Answer</h4>
                          </div>
                          <p>{question.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionList; 