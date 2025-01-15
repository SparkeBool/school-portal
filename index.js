require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pupilRoutes = require('./routes/pupilRoutes');
const resultRoutes = require('./routes/resultRoutes');
const dbConnect = require('./config/db');

// App initialization
const app = express();

const uploadDir = 'uploads/passports';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Handle cookies
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: false })); // Allow cross-origin requests\
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Foo'],
  maxAge: 3600,
  credentials: true
}));
 
app.use('/uploads/passports', express.static(path.join(__dirname, 'uploads/passports'))); // Serve static files
app.use("/", express.static(path.join(__dirname +'/public'))); 
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/pupil', pupilRoutes); 
app.use('/api/results', resultRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;

dbConnect();

app.listen(PORT, ()=>{
  console.log(`Server Listening on port ${PORT}`)
})