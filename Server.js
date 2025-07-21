import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to handle form submission
app.post('/send-email', async (req, res) => {
  const { fullName, email, service, message } = req.body;

  // Validate request body
  if (!fullName || !email || !service || !message) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  try {
    // Create a transporter using your email provider details
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Gmail email
        pass: process.env.EMAIL_PASS, // App password (not regular password)
      },
    });

    // Email options
    let mailOptions = {
      from: `"${fullName}" <${email}>`, // Sender name & email
      to: 'innovimagine@gmail.com', // Business email
      subject: `Consultation Request from ${fullName}`,
      text: `
        You have a new consultation request.

        Full Name: ${fullName}
        Email: ${email}
        Service of Interest: ${service}
        Message: ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ message: 'Error sending email', error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
