const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/assessments', require('./src/routes/assessmentRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Define Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
