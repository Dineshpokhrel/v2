import express from 'express';
import { getDataForMonth, getDataForDay } from '../services/publicEvent2.js'; 

const router = express.Router();

router.get('/month_data/:year/:month', (req, res) => {
  try {
    //const { year, month } = req.query;
    const { year, month } = req.params;
    //const year=2080;
    //const month= '09';
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month parameters are required.' });
    }
    const monthData = getDataForMonth(year, month);
    //const monthData = getDataForMonth(Number(year), Number(month));

    res.status(200).json({ data: monthData });
  } catch (error) {
    console.error('Error fetching month data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


router.get('/day_data/:year/:month/:day', (req, res) => {
  try {
    const { year, month, day } = req.params;
    // const year=2080;
    // const month='12';
    // const day='11';

    if (!year || !month || !day) {
      return res.status(400).json({ error: 'Year, month, and day parameters are required.' });
    }
    const dayData = getDataForDay(year, month, day);
    //const dayData = getDataForDay(Number(year), Number(month), Number(day));

    res.status(200).json({ data: dayData });
  } catch (error) {
    console.error('Error fetching day data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
