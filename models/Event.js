import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  kind: String,
  etag: String,
  id: String,
  status: String,
  htmlLink: String,
  created: Date,
  updated: Date,
  summary: String,
  location: String,
  creator: {
    email: String,
    self: Boolean
  },
  organizer: {
    email: String,
    self: Boolean
  },
  start: {
    dateTime: Date,
    timeZone: String
  },
  end: {
    dateTime: Date,
    timeZone: String
  },
  iCalUID: String,
  sequence: Number,
  reminders: {
    useDefault: Boolean
  },
  eventType: String
});

const Event = mongoose.model('Event', eventSchema);

export default Event;

