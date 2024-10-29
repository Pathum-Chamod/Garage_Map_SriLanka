const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const User = require('./models/user');
const Garage = require('./models/garage');
const validateGarage = require('./middleware/garageValidation');
const authenticate = require('./middleware/authMiddleware');

// Load environment variables from .env file
dotenv.config();

// Check if required environment variables are set
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("FATAL ERROR: MONGO_URI or JWT_SECRET is not defined.");
  process.exit(1); // Exit the application if critical environment variables are missing
}

const app = express();
app.use(express.json());

// Use CORS to allow requests from frontend (localhost:3000)
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.8.173:3000'], // Allow requests from frontend
  credentials: true, // Allow credentials (like cookies) to be sent if needed
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Rate limiting for login and registration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increase to 50 requests per 15 minutes during development
  message: 'Too many requests, please try again after 15 minutes',
});

// Test endpoint
app.get('/', (req, res) => {
  res.send('Garage Map API is running...');
});

// Register a new user with Joi validation and rate limiting
app.post('/api/register', authLimiter, async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$'))
      .required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ username, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Error occurred during registration' });
  }
});

// User login with rate limiting
app.post('/api/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Logout Route
app.post('/api/logout', authenticate, (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// Add a new garage with validation and authentication
app.post('/api/garages', authenticate, validateGarage, async (req, res) => {
  try {
    const garage = new Garage(req.body);
    await garage.save();
    res.status(201).json(garage);
  } catch (error) {
    console.error('Garage creation error:', error);
    res.status(400).json({ error: 'An error occurred while saving the garage' });
  }
});

// Get all garages with filtering by district, service, and vehicle type
app.get('/api/garages', async (req, res) => {
  const { district, service, vehicle } = req.query;
  const query = {};

  if (district && district !== 'All of Sri Lanka') {
    query.district = district;
  }

  if (service && service !== 'All Services') {
    query.category = service;
  }

  if (vehicle && vehicle !== 'All Types') {
    query.vehicleTypes = vehicle;
  }

  try {
    const garages = await Garage.find(query);
    res.status(200).json(garages);
  } catch (error) {
    console.error('Fetching garages error:', error);
    res.status(500).json({ error: 'An error occurred while retrieving garages' });
  }
});

// Generic error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong, please try again later.' });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
