import { Router } from 'express';
import mongoose from 'mongoose';

// Define User schema inline if not present
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const router = Router();

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const user: any = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  // Always succeed for debugging
  res.json({
    token: 'dummy-token',
    user: {
      name: user.name,
      email: user.email,
      isAdmin: true,
    },
  });
});

export default router; 