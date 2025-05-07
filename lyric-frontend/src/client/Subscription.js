import React, { useState } from "react";
import "./Subscriptions.css";

// Function to generate a unique premium code
const generatePremiumCode = () => {
  return "SHREE-" + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Subscription plans
const plans = [
  {
    name: "Weekly",
    price: 99,
    color: "#ffd70c",
    bg: "https://wallpaperset.com/w/full/5/d/8/121741.jpg",
    features: [
      "Unlimited Songs",
      "Concert Ticket Booking",
      "Premium Support",
      "Connect With Artist"
    ]
  },
  {
    name: "Montly",
    price: 499,
    color: "#f96e6e",
    bg: "https://wallpaperset.com/w/full/5/d/8/121741.jpg",
    features: [
      "Unlimited Songs",
      "Concert Ticket Booking",
      "Premium Support",
      "Connect With Artist"
    ]
  },
  {
    name: "Yearly",
    price: 999,
    color: "#362e42",
    bg: "https://wallpaperset.com/w/full/5/d/8/121741.jpg",
    features: [
      "Unlimited Songs",
      "Concert Ticket Booking",
      "Premium Support",
      "Connect With Artist"
    ]
  }
];

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    months: 1
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [premiumCode, setPremiumCode] = useState("");

  // Reset form and submission state
  const handleCloseSuccess = () => {
    setSubmitted(false);
    setSelectedPlan(null);
    setFormVisible(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      months: 1
    });
  };

  const handlePurchase = (plan) => {
    setSelectedPlan(plan);
    setFormVisible(true);
    setSubmitted(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Start payment processing
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Generate unique premium code
      const code = generatePremiumCode();
      setPremiumCode(code);
      
      // Store premium code in localStorage
      localStorage.setItem('premiumCode', code);
      
      // Stop processing and show success
      setIsProcessing(false);
      setSubmitted(true);
    }, 2000); // 2 seconds processing time
  };

  return (
    <div className="subs-bg">
      <div className="subs-container">
        {plans.map(plan => (
          <div className="subs-card" key={plan.name}>
            <div
              className="subs-card__info"
              style={{ backgroundImage: `linear-gradient(120deg, rgba(184,0,90,0.55), rgba(79,140,255,0.35)), url(${plan.bg})` }}
            >
              <h2 className="subs-card__name" style={{letterSpacing:2, fontWeight:700}}>{plan.name}</h2>
              <p className="subs-card__price" style={{ color: plan.color, fontWeight:700, fontSize:26 }}>
                ₹{plan.price}<span className="subs-card__priceSpan">/{plan.name === 'Weekly' ? 'week' : plan.name === 'Montly' ? 'month' : 'year'}</span>
              </p>
            </div>
            <div
              className="subs-card__content"
              style={{ borderTopColor: plan.color, borderBottomColor: plan.color }}
            >
              <div className="subs-card__rows">
                {plan.features.map((f, i) => (
                  <p className="subs-card__row" key={f} style={{fontWeight:600, color:'#3a1c71', background:i%2===0?'#fff5fa':'#f7eaff'}}>
                    <span style={{marginRight:8}}>✔️</span>{f}
                  </p>
                ))}
              </div>
              <button
                className="subs-card__link"
                style={{ background: `linear-gradient(90deg,${plan.color},#b8005a)` }}
                onClick={() => handlePurchase(plan)}
              >
                GET PREMIUM
              </button>
            </div>
          </div>
        ))}
      </div>

      {formVisible && !submitted && (
        <div className="subs-modal-bg">
          <div className="subs-modal-form">
            <form onSubmit={handleSubmit} className="subs-modal-form-inner">
              <h2 style={{color:'#b8005a',marginBottom:12}}>Subscribe to <span style={{color:selectedPlan?.color}}>{selectedPlan?.name}</span></h2>
              <input type="hidden" name="subscriptionType" value={selectedPlan?.name} />
              <label htmlFor="firstName">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

              <label htmlFor="lastName">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />

              <label htmlFor="phoneNumber">Phone Number</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

              <label htmlFor="months">No. of Months</label>
              <input type="number" name="months" value={formData.months} onChange={handleChange} required min={1} />

              <button type="submit" style={{ background: `linear-gradient(90deg,${selectedPlan?.color},#b8005a)` }}>Pay & Subscribe</button>
              <button type="button" className="cancel" onClick={() => setFormVisible(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="processing-container">
          <div className="spinner"></div>
          <p style={{color:'#b8005a',fontWeight:600,marginTop:8}}>Processing Payment...</p>
        </div>
      )}

      {submitted && (
        <div className="success-container">
          <button 
            className="close-success-btn" 
            onClick={handleCloseSuccess}
          >
            ✕
          </button>
          <h2 style={{color:'#4f8cff',marginBottom:12}}>Payment Successful!</h2>
          <div className="payment-details">
            <p>Subscription: <strong>{selectedPlan.name}</strong> Plan</p>
            <p>Duration: {formData.months} month{formData.months > 1 ? 's' : ''}</p>
            <p>Total Amount: <span style={{color:'#b8005a',fontWeight:700}}>₹{selectedPlan.price * formData.months}</span></p>
          </div>
          <div className="premium-code-section">
            <h3 style={{color:'#b8005a'}}>Your Premium Access Code</h3>
            <div className="premium-code">{premiumCode}</div>
            <p style={{color:'#3a1c71'}}>Keep this code safe. You'll need it to access exclusive content.</p>
          </div>
        </div>
      )}
    </div>
  );
}
