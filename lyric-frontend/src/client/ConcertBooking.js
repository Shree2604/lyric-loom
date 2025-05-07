import React, { useState } from "react";

const CONCERTS = [
  {
    id: "arijit",
    name: "Arjit Singh",
    date: "18/4/2024",
    time: "5:00 pm",
    price: 50,
    img: "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "sonu",
    name: "Sonu Nigam",
    date: "4/4/2024",
    time: "7:30 pm",
    price: 670,
    img: "https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "shreya",
    name: "Shreya Goshal",
    date: "7/7/2024",
    time: "6:30 pm",
    price: 980,
    img: "https://images.pexels.com/photos/1677710/pexels-photo-1677710.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: "arr",
    name: "A.R.Rahman",
    date: "21/3/2024",
    time: "9:30 pm",
    price: 550,
    img: "https://images.pexels.com/photos/7715613/pexels-photo-7715613.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=279.825&fit=crop&h=453.05"
  }
];

export default function ConcertBooking() {
  const [quantities, setQuantities] = useState(CONCERTS.map(() => 0));
  const [totals, setTotals] = useState(CONCERTS.map(() => 0));
  const [showInfo, setShowInfo] = useState(CONCERTS.map(() => false));

  const handleQuantityChange = (idx, value) => {
    const qty = Math.max(0, parseInt(value) || 0);
    const newQuantities = [...quantities];
    newQuantities[idx] = qty;
    setQuantities(newQuantities);
    const newTotals = [...totals];
    newTotals[idx] = qty * CONCERTS[idx].price;
    setTotals(newTotals);
  };

  const handleShowInfo = idx => {
    setShowInfo(showInfo.map((val, i) => (i === idx ? !val : val)));
  };

  const handleBook = idx => {
    // You can extend this to save booking info or redirect
    alert(`Booked ${quantities[idx]} ticket(s) for ${CONCERTS[idx].name} on ${CONCERTS[idx].date} at ${CONCERTS[idx].time}. Total: ₹${totals[idx]}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'rgba(0,0,0,0.7) url(https://media.istockphoto.com/id/821475092/photo/presentation-concept.webp?b=1&s=170667a&w=0&k=20&c=UHYSZZKY6j_5ixJLIQ6LiNIA23F3rQ2gRwvLnva8SzA=) center/cover no-repeat', padding: 0 }}>
      <div className="sign" style={{ textAlign: 'center', fontFamily: 'Clip', fontSize: '3em', color: '#ffe6ff', textShadow: '0 0 0.6rem #ffe6ff, 0 0 1.5rem #ff65bd, -0.2rem 0.1rem 1rem #ff65bd, 0.2rem 0.1rem 1rem #ff65bd, 0 -0.5rem 2rem #ff2483, 0 0.5rem 3rem #ff2483', marginTop: 40, marginBottom: 40, letterSpacing: 2 }}>
        <span className="fast-flicker">concert-</span><span className="flicker">Ticket-</span>Booking
      </div>
      <div className="concert-info" style={{ display: 'flex', marginTop: 40, justifyContent: 'center', gap: 24 }}>
        {CONCERTS.map((concert, idx) => (
          <div className="concert-card" key={concert.id} style={{ width: 320, margin: 10, boxShadow: '0 0 5px rgba(0,0,0,0.2)', borderRadius: 8, background: '#fff', overflow: 'hidden', animation: idx % 2 === 0 ? 'slideInFromTop 1s ease' : 'slideInFromBottom 1s ease' }}>
            <img src={concert.img} alt={concert.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
            <h3>{concert.name}</h3>
            <p>Date: {concert.date} | Time: {concert.time}</p>
            <div className="ticket-booking" style={{ padding: 10, borderTop: '1px solid #ddd' }}>
              <div className="concert-dropdown" style={{ position: 'relative', display: 'inline-block' }}>
                <button className="dropdown-btn" style={{ background: '#b702fe', color: '#fff', padding: '10px 20px', border: 'none', cursor: 'pointer', marginTop: 10, borderRadius: 6, fontWeight: 600 }} onClick={() => handleShowInfo(idx)}>
                  Concert Info
                </button>
                {showInfo[idx] && (
                  <div className="dropdown-content" style={{ position: 'absolute', background: '#f9f9f9', minWidth: 160, boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)', padding: '12px 16px', zIndex: 1, borderRadius: 8, top: 42 }}>
                    <h3>{concert.name}</h3>
                    <p>Date: {concert.date} | Time: {concert.time}</p>
                    <p>Price per Ticket: ₹ {concert.price}</p>
                  </div>
                )}
              </div>
              <p>Number of Tickets:</p>
              <div className="quantity-counter" style={{ display: 'flex', alignItems: 'center' }}>
                <input type="number" className="ticket-count" min="0" value={quantities[idx]} onChange={e => handleQuantityChange(idx, e.target.value)} style={{ width: 50, padding: 5, textAlign: 'center', borderRadius: 6, border: '1px solid #aaa' }} />
              </div>
              <p>Price per Ticket: ₹ {concert.price}</p>
              <p>Total: ₹ <span className="total-cost">{totals[idx]}</span></p>
              <button className="book-now" style={{ background: '#b702fe', color: '#fff', padding: '10px 20px', border: 'none', cursor: 'pointer', marginTop: 10, borderRadius: 6, fontWeight: 600 }} onClick={() => handleBook(idx)} disabled={quantities[idx] === 0}>Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
