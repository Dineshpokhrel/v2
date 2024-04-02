import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  action: String, // login, logout, createevent, updateevent, deleteevent
  message: String,
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  timestamp: { type: Date, default: Date.now },
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
