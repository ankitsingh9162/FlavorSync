import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

mongoose.connect('mongodb://localhost:27017/piggy')
  .then(async () => {
    const existing = await User.findOne({ email: 'admin@piggy.com' });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const admin = new User({
        name: 'Super Admin',
        email: 'admin@piggy.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Created admin account!');
    } else {
      existing.role = 'admin';
      await existing.save();
      console.log('Admin account was already created. Fixed role.');
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
