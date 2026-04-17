import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await User.findOne({ email: 'admin@FlavorSync.com' });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const admin = new User({
        name: 'Super Admin',
        email: 'admin@FlavorSync.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Created admin account in Atlas!');
    } else {
      existing.role = 'admin';
      await existing.save();
      console.log('Admin account was already created in Atlas. Fixed role.');
    }
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
