import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function TicketQRCode({ ticket }) {
  if (!ticket) return null;
  // You can encode any ticket field or a JSON string
  const qrValue = JSON.stringify({
    concert: ticket.concertName,
    date: ticket.concertDetails,
    count: ticket.ticketCount,
    code: ticket.cardNumber?.slice(-4) || Math.random().toString(36).substr(2, 6)
  });
  return (
    <div style={{ textAlign: "center", marginTop: 16 }}>
      <QRCodeCanvas value={qrValue} size={120} bgColor="#fff" fgColor="#b8005a" />
      <div style={{ fontSize: 12, marginTop: 8, color: '#232526' }}>Show this QR code at entry</div>
    </div>
  );
}
