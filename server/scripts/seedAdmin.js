// seedAdmin.js - run with `node server/scripts/seedAdmin.js`
// Ensure you have bcrypt installed: npm install bcryptjs
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../../.env' });

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('AdminPass123!', salt);
    const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: hashed });
    console.log('Admin user created:', admin);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
})();
