import React, { useState, useRef, useEffect } from 'react';
import API from '../services/api';
import { useCart } from '../context/CartContext';

const samplePrompts = [
  'Belgian Chocolate ka taste kaisa hai? 🍫',
  'Alphonso Mango kitna sweet hai? 🥭',
  '₹200 ke andar 2 logo ke liye chocolate 🍨',
  'Roasted Almond Fudge taste guide 🥜',
  'Matka Malai Kulfi texture & sweetness 🏺',
  'Coffee Shake strong hai ya sweet? ☕',
];

const AIChatModal = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! 🍦 I am your Hangout AI Ice Cream Assistant. What are you craving today? Tell me your budget, favourite flavour, or group size in English, Hindi, or Hinglish!',
      recommendations: [],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedComboId, setAddedComboId] = useState(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await API.post('/ai/chat', {
        message: textToSend,
        history: historyPayload,
      });

      if (response.data.success) {
        const aiData = response.data.data;
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: aiData.reply || 'Here are the options for you:',
            recommendations: aiData.recommendations || [],
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: error.response?.data?.message || 'Sorry, I had trouble checking our ice cream inventory. Please try again!',
          recommendations: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecToCart = (rec) => {
    if (!rec.items || rec.items.length === 0) return;
    rec.items.forEach((item) => {
      addToCart(
        {
          _id: item.productId,
          name: item.name,
          price: item.price,
          size: item.size || 'Standard',
        },
        item.quantity || 1
      );
    });
    setAddedComboId(rec.id);
    setTimeout(() => setAddedComboId(null), 1500);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header ai-modal-header py-3 px-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-white text-purple d-flex align-items-center justify-content-center fw-bold"
                style={{ width: '40px', height: '40px', fontSize: '1.2rem', color: '#7b2cbf' }}
              >
                🤖
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0 text-white">Hangout AI Assistant</h5>
                <span className="small text-white-50">Smart Hinglish/English Recommendation Engine</span>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Chat Body */}
          <div className="modal-body p-4 bg-light d-flex flex-column gap-3" style={{ minHeight: '380px' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex flex-column ${
                  msg.sender === 'user' ? 'align-items-end' : 'align-items-start'
                }`}
              >
                <div className={msg.sender === 'user' ? 'chat-message-user' : 'chat-message-ai'}>
                  <div className="mb-0" style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                    {msg.text}
                  </div>

                  {/* Recommendations Cards */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 d-flex flex-column gap-2 w-100">
                      {msg.recommendations.map((rec) => (
                        <div key={rec.id} className="recommendation-card">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="fw-bold mb-0 text-dark">
                              🍦 {rec.title || 'Recommended Option'}
                            </h6>
                            <span className="badge bg-dark text-white rounded-pill px-3 py-1 fs-6">
                              ₹{rec.totalPrice}
                            </span>
                          </div>

                          <p className="text-secondary small mb-2">{rec.explanation}</p>

                          <div className="bg-light p-2 rounded-3 mb-2 small text-muted">
                            {rec.items &&
                              rec.items.map((it, idx) => (
                                <div key={idx} className="d-flex justify-content-between">
                                  <span>• {it.name} ({it.size || '1 Scoop'})</span>
                                  <span className="fw-semibold">₹{it.price}</span>
                                </div>
                              ))}
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            <button
                              className="btn btn-sm btn-pink text-white rounded-pill px-3 fw-bold border-0"
                              style={{ background: 'linear-gradient(135deg, #ff477e 0%, #ff70a6 100%)' }}
                              onClick={() => handleAddRecToCart(rec)}
                            >
                              {addedComboId === rec.id ? (
                                <>
                                  <i className="bi bi-check-circle-fill me-1"></i> Added to Cart!
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-bag-plus me-1"></i> Add to Cart
                                </>
                              )}
                            </button>

                            <button
                              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                              onClick={() => handleSend(`Show more options like ${rec.title}`)}
                            >
                              Show More
                            </button>

                            <button
                              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                              onClick={() => setInputQuery('₹300 ke andar options dikhao')}
                            >
                              Change Budget
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="align-self-start chat-message-ai d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm text-pink" role="status"></div>
                <span className="small text-muted">Hangout AI is searching MongoDB menu...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Sample Prompts */}
          <div className="px-4 py-2 bg-white border-top">
            <div className="small text-muted mb-1 fw-semibold">Try asking:</div>
            <div className="category-pills-scroll py-1">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  className="btn btn-sm btn-light border text-dark rounded-pill me-1 text-nowrap"
                  onClick={() => handleSend(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="modal-footer bg-white p-3 border-top-0">
            <form
              className="w-100 d-flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                className="form-control rounded-pill px-3 py-2 border-2"
                placeholder="Ask AI e.g. '₹200 ke andar 2 logo ke liye chocolate'..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-pink rounded-circle text-white p-2 d-flex align-items-center justify-content-center"
                style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #7b2cbf 0%, #ff477e 100%)',
                }}
                disabled={loading || !inputQuery.trim()}
              >
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;
