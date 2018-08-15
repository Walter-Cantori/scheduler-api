const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../../config/auth');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  },

  generateToken() {
    return jwt.sign({ id: this.id }, secret, {
      expiresIn: 86400,
    });
  },
};

mongoose.model('User', UserSchema);
