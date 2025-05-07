import React, { useRef } from "react";
import TicketQRCode from "./TicketQRCode";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Concerts.css";

export default function TicketDetailsModal({ show, ticket, onClose }) {
  const pdfRef = useRef();
  if (!show || !ticket) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Concert Ticket Details", 14, 18);
    doc.setFontSize(12);
    doc.autoTable({
      startY: 28,
      head: [["Field", "Value"]],
      body: [
        ["Concert Name", ticket.concertName],
        ["Concert Details", ticket.concertDetails],
        ["Ticket Count", ticket.ticketCount],
        ["Total Cost", `₹${ticket.totalCost}`],
        ["Phone Number", ticket.phoneNumber],
        ["Payment Method", ticket.paymentMethod],
        ["Card Name", ticket.cardName],
        ["Card Number", ticket.cardNumber],
        ["Card Expiry", ticket.cardExpiry],
        ["Card CVV", ticket.cardCVV],
      ],
    });
    // QR code as image
    const qrCanvas = document.querySelector(".ticket-qr-canvas canvas");
    if (qrCanvas) {
      const qrImg = qrCanvas.toDataURL("image/png");
      doc.addImage(qrImg, "PNG", 150, 20, 40, 40);
    }
    doc.save("concert_ticket.pdf");
  };

  return (
    <div className="modal fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.32)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="ticket-details-modal">
        <div className="ticket-details-header">Concert Ticket Details</div>
        <div className="ticket-details-body">
          <div className="ticket-details-col">
            <p><strong>Concert Name:</strong> {ticket.concertName}</p>
            <p><strong>Concert Details:</strong> {ticket.concertDetails}</p>
            <p><strong>Ticket Count:</strong> {ticket.ticketCount}</p>
            <p><strong>Total Cost:</strong> ₹{ticket.totalCost}</p>
          </div>
          <div className="ticket-details-col">
            <p><strong>Phone Number:</strong> {ticket.phoneNumber}</p>
            <p><strong>Payment Method:</strong> {ticket.paymentMethod}</p>
            <p><strong>Card Name:</strong> {ticket.cardName}</p>
            <p><strong>Card Number:</strong> {ticket.cardNumber}</p>
            <p><strong>Card Expiry:</strong> {ticket.cardExpiry}</p>
            <p><strong>Card CVV:</strong> {ticket.cardCVV}</p>
          </div>
        </div>
        <div className="ticket-qr-canvas">
          <TicketQRCode ticket={ticket} />
        </div>
        <div className="ticket-modal-btns">
          <button className="btn btn-success btn-block" onClick={handleDownloadPDF}>
            Download PDF
          </button>
          <button className="btn btn-secondary btn-block" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
