import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Concerts.css";
import TicketPaymentModal from "./TicketPaymentModal";
import TicketDetailsModal from "./TicketDetailsModal";

const CONCERTS = [
  {
    id: "arijit",
    name: "Arijit Singh Live in Concert",
    date: "18/05/2025",
    time: "7:00 pm",
    price: 1200,
    img: "https://images.pexels.com/photos/1679825/pexels-photo-1679825.jpeg?auto=compress&cs=tinysrgb&w=600",
    venue: "NSCI Dome, Mumbai",
    description: "Experience the soulful voice of Arijit Singh performing his greatest hits live."
  },
  {
    id: "sonu",
    name: "Sonu Nigam Grand Night",
    date: "24/05/2025",
    time: "8:00 pm",
    price: 999,
    img: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=600",
    venue: "Indira Gandhi Stadium, Delhi",
    description: "Join Sonu Nigam for an electrifying night of music and nostalgia."
  },
  {
    id: "shreya",
    name: "Shreya Ghoshal Melodies",
    date: "07/06/2025",
    time: "6:30 pm",
    price: 1500,
    img: "https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=600",
    venue: "Bangalore Palace Grounds, Bangalore",
    description: "Let Shreya Ghoshal's melodious voice take you on a magical journey."
  },
  {
    id: "arr",
    name: "A.R. Rahman Live Experience",
    date: "21/06/2025",
    time: "9:00 pm",
    price: 2000,
    img: "https://images.pexels.com/photos/167446/pexels-photo-167446.jpeg?auto=compress&cs=tinysrgb&w=600",
    venue: "Jawaharlal Nehru Stadium, Chennai",
    description: "Witness the maestro A.R. Rahman and his band in a spectacular musical night."
  },
  {
    id: "neha",
    name: "Neha Kakkar Party Night",
    date: "12/07/2025",
    time: "8:30 pm",
    price: 1100,
    img: "https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg?auto=compress&cs=tinysrgb&w=600",
    venue: "Gachibowli Stadium, Hyderabad",
    description: "Dance to the peppy beats of Neha Kakkar's chartbusters!"
  },
  {
    id: "kk",
    name: "KK Tribute Evening",
    date: "02/08/2025",
    time: "7:30 pm",
    price: 800,
    img: "https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg?auto=compress&cs=tinysrgb&w=600",
    venue: "Shanmukhananda Hall, Mumbai",
    description: "A heartfelt tribute to the evergreen voice of KK with special performances."
  }
];

// Concert Info Modal Component
function ConcertInfoModal({ show, concert, onClose }) {
  if (!show || !concert) return null;
  return (
    <div className="concert-info-modal-overlay" onClick={onClose}>
      <div className="concert-info-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <img src={concert.img} alt={concert.name} className="concert-info-img" />
        <h2>{concert.name}</h2>
        <p><strong>Date:</strong> {concert.date}</p>
        <p><strong>Time:</strong> {concert.time}</p>
        <p><strong>Venue:</strong> {concert.venue}</p>
        <p><strong>Price:</strong> ₹ {concert.price}</p>
        <p><strong>Description:</strong> {concert.description}</p>
      </div>
    </div>
  );
}

export default function Concerts() {
  const navigate = useNavigate();
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [premiumCode, setPremiumCode] = useState('');
  const [quantities, setQuantities] = useState(CONCERTS.map(() => 0));
  const [totals, setTotals] = useState(CONCERTS.map(() => 0));
  const [showInfo, setShowInfo] = useState(false);
  const [infoIdx, setInfoIdx] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  const handleQuantityChange = (idx, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    const newQuantities = [...quantities];
    newQuantities[idx] = qty;
    setQuantities(newQuantities);
    const newTotals = [...totals];
    newTotals[idx] = qty * CONCERTS[idx].price;
    setTotals(newTotals);
  };

  const handleBook = idx => {
    setSelectedIdx(idx);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (ticket) => {
    setTicketData(ticket);
    setShowPayment(false);
    setShowTicket(true);
  };

  // Premium code validation
  const handlePremiumCodeSubmit = (e) => {
    e.preventDefault();
    const storedCode = localStorage.getItem('premiumCode');
    
    if (premiumCode.trim() === storedCode) {
      // Validate and store the code
      localStorage.setItem('concertAccess', 'true');
      setIsPremiumUnlocked(true);
    } else {
      alert('Invalid Premium Code');
      setPremiumCode('');
    }
  };

  // Check for existing access on component mount
  useEffect(() => {
    const hasAccess = localStorage.getItem('concertAccess') === 'true';
    setIsPremiumUnlocked(hasAccess);
  }, []);

  // If not unlocked, show premium code overlay
  if (!isPremiumUnlocked) {
    return (
      <div className="locked-page">
        <div className="locked-content">
          <h2>🔒 Exclusive Concert Tickets</h2>
          <p>This page requires a Premium Code to access</p>
          <form onSubmit={handlePremiumCodeSubmit}>
            <input 
              type="text" 
              placeholder="Enter Premium Code"
              value={premiumCode}
              onChange={(e) => setPremiumCode(e.target.value)}
              required 
            />
            <button type="submit">Unlock Page</button>
          </form>
          <div className="hint-text">
            <p>💡 Hint: Get your Premium Code from the Subscription page</p>
          </div>
          <button 
            className="back-button" 
            onClick={() => navigate('/subscribe')}
          >
            Get Premium Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="concerts-bg">
      <div className="sign">
        <span className="fast-flicker">Concert-</span><span className="flicker">Ticket-</span>Booking
      </div>
      <div className="concert-info">
        {CONCERTS.map((concert, idx) => (
          <div className="concert-card" key={concert.id}>
            <img src={concert.img} alt={concert.name} />
            <h3>{concert.name}</h3>
            <p>Date: {concert.date} | Time: {concert.time}</p>
            <div className="ticket-booking">
              <button className="concert-info-btn" onClick={() => { setShowInfo(true); setInfoIdx(idx); }}>Concert Info</button>
              <p>Number of Tickets:</p>
              <div className="quantity-counter">
                <input type="number" className="ticket-count" min="0" value={quantities[idx]} onChange={e => handleQuantityChange(idx, e.target.value)} />
              </div>
              <p>Price per Ticket: ₹ {concert.price}</p>
              <p>Total: ₹ <span className="total-cost">{totals[idx]}</span></p>
              <button className="book-now" onClick={() => handleBook(idx)} disabled={quantities[idx] === 0}>Pay Now</button>
            </div>
          </div>
        ))}
      </div>
      <ConcertInfoModal
        show={showInfo}
        concert={infoIdx !== null ? CONCERTS[infoIdx] : null}
        onClose={() => setShowInfo(false)}
      />
      {showPayment && selectedIdx !== null && (
        <TicketPaymentModal
          show={showPayment}
          onClose={() => setShowPayment(false)}
          concert={CONCERTS[selectedIdx]}
          ticketCount={quantities[selectedIdx]}
          totalCost={totals[selectedIdx]}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {showTicket && ticketData && (
        <TicketDetailsModal
          show={showTicket}
          ticket={ticketData}
          onClose={() => setShowTicket(false)}
        />
      )}
    </div>
  );
}
