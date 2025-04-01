// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Personal Information
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  accountType: { type: String, enum: ['savings', 'current'], required: true },
  country: { type: String, required: true },
  
  // Verification Information
  ssn: { type: String, required: true },
  dob: { type: Date, required: true },
  photoId: { type: String, required: true },
  
  // File uploads paths
  photoIdUpload: { type: String, required: true },
  proofOfAddressUpload: { type: String, required: true },
  photoUpload: { type: String, required: true },
  creditCardFront: { type: String, required: true },
  creditCardBack: { type: String, required: true },
  
  // Phone Number for MFA
  phoneNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
