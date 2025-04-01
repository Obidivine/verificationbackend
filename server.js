// server.js
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
const User = require('./models/user');



// Connect to MongoDB (replace with your connection string)
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


// Create an uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename by prefixing Date.now()
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Since our form includes file uploads along with text fields, we'll use multer to handle both.
// Define the fields that are expected.
const cpUpload = upload.fields([
  { name: 'photoIdUpload', maxCount: 1 },
  { name: 'proofOfAddressUpload', maxCount: 1 },
  { name: 'photoUpload', maxCount: 1 },
  { name: 'creditCardFront', maxCount: 1 },
  { name: 'creditCardBack', maxCount: 1 },
]);

// Endpoint to handle form submission
app.post('/submit-form', cpUpload, async (req, res) => {
  try {
    // Access text fields via req.body
    const {
      firstName,
      middleName,
      lastName,
      accountType,
      country,
      ssn,
      confirmSsn, // you might want to verify that ssn and confirmSsn match
      photoId,
      dob,
      proofOfAddress,
      phoneNumber,
    } = req.body;

    // Access uploaded files. Multer puts them in req.files.
    // Each field will be an array even if maxCount is 1.
    const photoIdUpload = req.files.photoIdUpload ? req.files.photoIdUpload[0].path : null;
    const proofOfAddressUpload = req.files.proofOfAddressUpload ? req.files.proofOfAddressUpload[0].path : null;
    const photoUpload = req.files.photoUpload ? req.files.photoUpload[0].path : null;
    const creditCardFront = req.files.creditCardFront ? req.files.creditCardFront[0].path : null;
    const creditCardBack = req.files.creditCardBack ? req.files.creditCardBack[0].path : null;

    // Basic SSN confirmation check
    if (ssn !== req.body.confirmSsn) {
      return res.status(400).json({ error: 'SSN values do not match' });
    }

    // Create and save the new user
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      accountType,
      country,
      ssn,
      dob,
      photoId,
      photoIdUpload,
      proofOfAddressUpload,
      photoUpload,
      creditCardFront,
      creditCardBack,
      phoneNumber,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully', data: savedUser });
  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
