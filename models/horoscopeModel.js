import mongoose from 'mongoose';

// const horoscopeSchema = new mongoose.Schema({
//   sign: { type: String, required: true }, // Zodiac sign (e.g., 'aries', 'taurus')
//   date: { type: Date, default: Date.now }, // Date of the horoscope (default to current date)
//   prediction: { type: String, required: true }, // Horoscope prediction or text
// });

const horoscopeSchema = new mongoose.Schema({
    sign: { type: String, required: true },
    daily: {
      type: {
        date: { type: Date, default: Date.now },
        prediction: { type: String },
      },
      default: {},
    },
    weekly: {
      type: {
        date: { type: Date, default: Date.now },
        prediction: { type: String },
      },
      default: {},
    },
    monthly: {
      type: {
        date: { type: Date, default: Date.now },
        prediction: { type: String },
      },
      default: {},
    },
    yearly: {
      type: {
        date: { type: Date, default: Date.now },
        prediction: { type: String },
      },
      default: {},
    },
});


const Horoscope = mongoose.model('Horoscope', horoscopeSchema);

export default Horoscope;
