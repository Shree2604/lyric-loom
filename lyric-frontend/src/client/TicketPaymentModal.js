import React, { useState } from "react";

function validateFields(phoneNumber, cardName, cardNumber, cardExpiry, cardCVV) {
  const errors = {};
  if (!/^[0-9]{10}$/.test(phoneNumber)) errors.phoneNumber = "Enter a valid 10-digit phone number.";
  if (!cardName.trim()) errors.cardName = "Card name required.";
  if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) errors.cardNumber = "Card number must be 16 digits.";
  if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) errors.cardExpiry = "Expiry must be MM/YY.";
  if (!/^\d{3,4}$/.test(cardCVV)) errors.cardCVV = "CVV must be 3 or 4 digits.";
  return errors;
}

export default function TicketPaymentModal({ show, onClose, concert, ticketCount, totalCost, onSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [statusStep, setStatusStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});

  if (!show) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitted(true);
    const errors = validateFields(phoneNumber, cardName, cardNumber, cardExpiry, cardCVV);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setProcessing(true);
    setPaymentStatus("");
    setStatusStep(0);
    // Simulate payment gateway status progression
    setTimeout(() => setStatusStep(1), 1000); // Amount Debited
    setTimeout(() => setStatusStep(2), 2000); // Payment Processed
    setTimeout(() => setStatusStep(3), 3000); // Amount Credited
    setTimeout(() => {
      setProcessing(false);
      setStatusStep(4);
      setPaymentStatus("success");
      onSuccess({
        concertName: concert.name,
        concertDetails: `Date: ${concert.date} | Time: ${concert.time}`,
        ticketCount,
        totalCost,
        phoneNumber,
        paymentMethod: "Card",
        cardName,
        cardNumber,
        cardExpiry,
        cardCVV
      });
    }, 4000);
  };

  const statusTexts = [
    "Initiating Payment...",
    "Amount Debited...",
    "Payment Processed...",
    "Amount Credited...",
    "Payment Successful!"
  ];

  return (
    <div className="modal fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.32)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card card-custom payment-modal-large" style={{ minWidth: 520, maxWidth: 600, minHeight: 560, height: 'auto', borderRadius: 16, boxShadow: '0 2px 18px #aaa', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div className="card-header bg-primary-custom text-white-custom">
          <h5 className="card-title">Payment Details</h5>
        </div>
        <div className="card-body">
          {processing ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div className="spinner-border text-primary" role="status" style={{ width: 40, height: 40 }}></div>
              <div style={{ marginTop: 14, color: '#b8005a', fontWeight: 500 }}>
                {statusTexts[statusStep]}
              </div>
            </div>
          ) : paymentStatus === "fail" ? (
            <div style={{ color: '#b8005a', textAlign: 'center', fontWeight: 600, marginBottom: 10 }}>
              Payment Failed. Please try again.
            </div>
          ) : (
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" className="form-control" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
                {submitted && formErrors.phoneNumber && <div style={{color:'#b8005a',fontSize:13}}>{formErrors.phoneNumber}</div>}
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <input type="text" className="form-control" value="Card" disabled readOnly />
              </div>
              <div className="form-group">
                <label>Card Name</label>
                <input type="text" className="form-control" value={cardName} onChange={e => setCardName(e.target.value)} required />
                {submitted && formErrors.cardName && <div style={{color:'#b8005a',fontSize:13}}>{formErrors.cardName}</div>}
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Card Number</label>
                  <input type="text" className="form-control" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />
                  {submitted && formErrors.cardNumber && <div style={{color:'#b8005a',fontSize:13}}>{formErrors.cardNumber}</div>}
                </div>
                <div className="form-group col-md-3">
                  <label>Expiry</label>
                  <input type="text" className="form-control" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} required placeholder="MM/YY" />
                  {submitted && formErrors.cardExpiry && <div style={{color:'#b8005a',fontSize:13}}>{formErrors.cardExpiry}</div>}
                </div>
                <div className="form-group col-md-3">
                  <label>CVV</label>
                  <input type="password" className="form-control" value={cardCVV} onChange={e => setCardCVV(e.target.value)} required />
                  {submitted && formErrors.cardCVV && <div style={{color:'#b8005a',fontSize:13}}>{formErrors.cardCVV}</div>}
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 16 }}>Pay Now</button>
              <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: 8 }} onClick={onClose}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
