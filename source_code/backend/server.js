const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;  // Use the PORT environment variable for flexibility

// Set CORS options to accept requests from the front-end domain
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000', // This will be your React app's URL
  optionsSuccessStatus: 200,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
};

// Apply middleware
app.use(cors(corsOptions)); // Use CORS options defined above
app.use(express.json());

// MongoDB connection using the URI from the environment variable
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  country: String,
  phoneNumber: String,
  age: Number,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', userSchema);

// Middleware to validate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API Routes
app.post('/api/register', async (req, res) => {
  const { password, ...userData } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ ...userData, password: hashedPassword });
    res.status(201).json({ message: "User created successfully", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: "Login successful", token });
});

app.get('/api/userinfo', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'public')));

// Catchall handler to send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server on the correct port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
