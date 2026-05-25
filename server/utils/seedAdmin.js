const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Auto-seeds the admin account on server startup.
 * Reads credentials from environment variables.
 * Does nothing if admin already exists.
 */
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (!adminEmail || !adminPassword) {
      console.log('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed.');
      return;
    }

    // Check if admin already exists
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      // If exists but role is not admin, upgrade it
      if (existing.role !== 'admin') {
        await User.findByIdAndUpdate(existing._id, { role: 'admin' });
        console.log('✅ Existing user upgraded to admin role:', adminEmail);
      } else {
        console.log('ℹ️  Admin account already exists:', adminEmail);
      }
      return;
    }

    // Create new admin account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('🎉 Admin account created successfully!');
    console.log(`   📧 Email: ${adminEmail}`);
    console.log(`   🔑 Password: (set in .env as ADMIN_PASSWORD)`);
  } catch (err) {
    console.error('❌ Error seeding admin account:', err.message);
  }
};

module.exports = seedAdmin;
