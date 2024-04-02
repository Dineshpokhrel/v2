import express from 'express';
import User from '../models/User.js';
import ActivityLog from '../models/activityLogModel.js';

const router = express.Router();

// Route to get user profile
router.get('/profile', (req, res) => {
  const { _id, googleId, displayName, email, profileImage } = req.user;
  const userProfile = { _id, googleId, displayName, email, profileImage };
  res.json(userProfile);
});

router.get('/activitylogs', async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.user._id }).populate('eventId');
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).send('Error fetching activity logs');
  }
});


export default router;
