import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/FlavorSync')
  .then(async () => {
    const res = await mongoose.connection.collection('users').updateOne(
      { email: 'admin@FlavorSync.com' }, 
      { $set: { role: 'admin' } }
    );
    console.log('Fixed admin role:', res.modifiedCount);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
