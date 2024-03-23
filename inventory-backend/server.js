// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name to avoid name conflicts
  },
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// Inventory Item Model
const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  imagePath: String,
});

const Item = mongoose.model('Item', itemSchema);

// Routes
// POST: Create a new inventory item
app.post('/api/items', upload.single('image'), async (req, res) => {
  const { name, quantity } = req.body;
  const item = new Item({
    name,
    quantity,
    imagePath: req.file ? req.file.path : '',
  });

  try {
    await item.save();
    res.status(201).send(item);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET: Fetch all inventory items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT: Update an inventory item
app.put('/api/items/:id', async (req, res) => {
  const updates = req.body;

  try {
    const item = await Item.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) {
      return res.status(404).send('Item not found.');
    }
    res.send(item);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// DELETE: Delete an inventory item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).send('Item not found.');
    }
    res.send(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const fs = require('fs');
const uploadsDir = './uploads';

if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir, { recursive: true });
}


// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
