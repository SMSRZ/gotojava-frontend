import React, { useState, useRef, useEffect } from 'react';
import './AIHelper.css';
import axios from 'axios';

const AIHelper = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  useEffect(() => {
    // Go fullscreen after the first AI response
    if (messages.length > 0 && messages.some(m => m.sender === 'ai') && !isFullscreen) {
      setIsFullscreen(true);
    }
  }, [messages, isFullscreen]);

  // Cleanup effect to restore body scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.get('https://gotojava-backend-production.up.railway.app/getReply', {
        params: { question: userMessage.text }
      });
      const data = res.data;
      setMessages((msgs) => [...msgs, { sender: 'ai', text: data }]);
    } catch (err) {
      console.error('AI Helper error:', err);
      let errorMessage = 'Sorry, something went wrong.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in to use AI Helper.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. You may not have permission to use AI Helper.';
      } else if (err.response?.data?.message) {
        errorMessage = `Error: ${err.response.data.message}`;
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }
      
      setMessages((msgs) => [...msgs, { sender: 'ai', text: errorMessage }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Scroll to bottom when user starts typing
    setTimeout(() => scrollToBottom(), 100);
  };

  const handleClose = () => {
    setOpen(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'auto'; // Re-enable body scrolling
  };

  const formatText = (text) => {
    // First handle code blocks
    const codeRegex = /```([\s\S]*?)```/g;
    const parts = text.split(codeRegex);
    
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        // This is a code block
        return <pre key={i} className="aihelper-code"><code>{part}</code></pre>;
      } else {
        // This is regular text - apply formatting
        let formattedText = part;
        
        // Handle bold text (**text**)
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic text (*text*)
        formattedText = formattedText.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
        
        // Handle newlines
        formattedText = formattedText.replace(/\n/g, '<br>');
        
        // Handle bullet points
        formattedText = formattedText.replace(/^[-•*]\s/gm, '• ');
        
        // Handle numbered lists
        formattedText = formattedText.replace(/^(\d+)\./gm, '<span class="list-number">$1.</span>');
        
        return (
          <span 
            key={i} 
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      }
    });
  };

  const renderMessage = (msg, idx) => {
    return (
      <div key={idx} className={`aihelper-message ${msg.sender}`}>
        {formatText(msg.text)}
      </div>
    );
  };

  return (
    <div>
      <button className="aihelper-bubble" onClick={() => {
        setOpen((o) => {
          const newOpen = !o;
          document.body.style.overflow = newOpen ? 'hidden' : 'auto';
          return newOpen;
        });
      }}>
        💬 AI Helper
      </button>
      {open && (
        <div className={`aihelper-chat-window${isFullscreen ? ' fullscreen' : ''}`}>
          <div className="aihelper-header">
            <span>AI Helper</span>
            <button className="aihelper-close" onClick={handleClose}>×</button>
          </div>
          <div className="aihelper-messages" ref={messagesContainerRef}>
            {messages.map(renderMessage)}
            <div ref={chatEndRef} />
          </div>
          <div className="aihelper-input-row">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={scrollToBottom}
              placeholder="Ask me anything..."
              rows={2}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHelper; 