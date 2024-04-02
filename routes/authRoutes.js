// routes/authRoutes.js

import express from 'express';
import passport from '../config/passport.js';
import ActivityLog from '../models/activityLogModel.js';

const router = express.Router();

router.get(
  '/google',
  (req, res, next) => {
    console.log('Initiating Google authentication...');
    next();
  },
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    accessType: 'offline',
  })
);

router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('Handling Google callback...');
    next();
  },
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  async  (req, res) => {
    const log = new ActivityLog({
      user: req.user._id,
      action: 'login',
      message: 'Logged in successfully'
    });
    await log.save();
    console.log('Redirecting after successful authentication...');
    res.redirect('/');
  }
);

router.get("/login/sucess",async(req,res)=>{

  if(req.user){
    // const log = new ActivityLog({
    //   user: req.user._id,
    //   action: 'login',
    //   message: 'Logged in successfully'
    // });
    // await log.save();
      res.status(200).json({message:"user Login",user:req.user})
  }else{
      res.status(400).json({message:"Not Authorized"})
  }
})

router.get('/logout', async (req, res) => {
  console.log('Logging out user...');
  const log = new ActivityLog({
    user: req.user._id,
    action: 'logout',
    message: 'logout successfully'
  });
  await log.save();
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      console.log('Session destroyed successfully.');
    }
  });
  res.redirect('/');
});

export default router;
