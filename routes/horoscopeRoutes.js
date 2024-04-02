import express from 'express';
import Horoscope from '../models/horoscopeModel.js';

const router = express.Router();
// Route to add a horoscope
router.post('/add', async (req, res) => {
  try {
    const { sign, prediction } = req.body;
    if (!sign || !prediction) {
      return res.status(400).json({ error: 'Sign and prediction are required' });
    }

    const newHoroscope = new Horoscope({ sign, prediction });
    await newHoroscope.save();

    res.status(201).json({ message: 'Horoscope added successfully', horoscope: newHoroscope });
  } catch (error) {
    console.error('Error adding horoscope:', error);
    res.status(500).json({ error: 'Failed to add horoscope' });
  }
});

// Route to retrieve all horoscopes for a specific date
router.get('/retrieve/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const horoscopes = await Horoscope.find({ date }).exec();

    if (horoscopes.length === 0) {
      return res.status(404).json({ error: 'No horoscopes found for the specified date' });
    }

    res.json({ horoscopes });
  } catch (error) {
    console.error('Error retrieving horoscopes:', error);
    res.status(500).json({ error: 'Failed to retrieve horoscopes' });
  }
});







// Route to add a horoscope for a specific interval (daily, weekly, monthly, yearly)
router.post('/add/:interval', async (req, res) => {
  try {
    const { sign, prediction } = req.body;
    const { interval } = req.params;

    if (!sign || !prediction || !['daily', 'weekly', 'monthly', 'yearly'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid input or interval specified' });
    }

    const update = { date: new Date(), prediction };
    const options = { upsert: true, new: true };

    await Horoscope.findOneAndUpdate({ sign }, { [interval]: update }, options);

    res.status(201).json({ message: `Horoscope added successfully for ${interval} interval` });
  } catch (error) {
    console.error('Error adding horoscope:', error);
    res.status(500).json({ error: 'Failed to add horoscope' });
  }
});

// Route to retrieve horoscope for a specific interval (daily, weekly, monthly, yearly)
router.get('/retrieve/:interval', async (req, res) => {
  try {
    const { interval } = req.params;

    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid interval specified' });
    }

    const horoscopes = await Horoscope.find({ [`${interval}.date`]: { $exists: true } }).exec();

    if (horoscopes.length === 0) {
      return res.status(404).json({ error: `No horoscopes found for ${interval} interval` });
    }

    res.json({ horoscopes });
  } catch (error) {
    console.error('Error retrieving horoscopes:', error);
    res.status(500).json({ error: 'Failed to retrieve horoscopes' });
  }
});


export  default router;
