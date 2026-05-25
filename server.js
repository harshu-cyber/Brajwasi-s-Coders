const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./server/config/db');
const authRoutes = require('./server/routes/authRoutes');
const contactRoutes = require('./server/routes/contactRoutes');
const careerRoutes = require('./server/routes/careerRoutes');

// Initialize database connection
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/career', careerRoutes);

// Static Client Folder Serving
app.use(express.static(path.join(__dirname, 'client')));

// Clean HTML routes without .html extensions
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dashboard.html'));
});

app.get('/careers', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'careers.html'));
});

// Fallback to index.html for any other non-API routes
app.get('*', (req, res) => {
  // If it's an API route that wasn't matched, send JSON error
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ success: false, error: 'API Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Brajwasi's Coders Server running in ${process.env.NODE_ENV || 'production'} mode on http://localhost:${PORT}`);
});
