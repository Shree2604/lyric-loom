// Backend: Real email sending for concert tickets using Node.js, Express, and Nodemailer
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

// TODO: Replace with your real email and app password
const EMAIL_USER = process.env.EMAIL_USER || 'shreeraj260405@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'DruvaLanji'; // Use App Password for Gmail

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Helper: Generate PDF buffer from ticket data
function generateTicketPDF(ticket) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A5', layout: 'portrait', margin: 36 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on('error', reject);

    doc.fontSize(20).fillColor('#b8005a').text('Concert Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).fillColor('#232526');
    doc.text(`Concert: ${ticket.concertName}`);
    doc.text(`Details: ${ticket.concertDetails}`);
    doc.text(`Ticket Count: ${ticket.ticketCount}`);
    doc.text(`Total Cost: ₹${ticket.totalCost}`);
    doc.text(`Phone Number: ${ticket.phoneNumber}`);
    doc.moveDown();
    doc.text('Show this PDF or your QR code at entry.', { align: 'center' });
    doc.end();
  });
}

router.post('/api/send-ticket', async (req, res) => {
  const { email, ticket } = req.body;
  if (!email || !ticket) {
    return res.status(400).json({ success: false, message: 'Missing email or ticket info' });
  }

  let pdfBuffer;
  try {
    pdfBuffer = await generateTicketPDF(ticket);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to generate PDF', error: err.message });
  }

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: `Your Concert Ticket for ${ticket.concertName}`,
    html: `
      <h2>Concert Ticket Details</h2>
      <ul>
        <li><b>Concert:</b> ${ticket.concertName}</li>
        <li><b>Details:</b> ${ticket.concertDetails}</li>
        <li><b>Ticket Count:</b> ${ticket.ticketCount}</li>
        <li><b>Total Cost:</b> ₹${ticket.totalCost}</li>
        <li><b>Phone Number:</b> ${ticket.phoneNumber}</li>
      </ul>
      <p>Show this email or your QR code at entry. Your ticket PDF is attached.</p>
    `,
    attachments: [
      {
        filename: `ConcertTicket-${ticket.concertName.replace(/\s+/g, '')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Ticket sent to your email!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send email', error: err.message });
  }
});

module.exports = router;
