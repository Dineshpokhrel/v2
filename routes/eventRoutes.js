import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { listEvents, createEvent, deleteEvent, updateEvent } from '../services/calendarService.js';
import Event from '../models/Event.js'; 
import ActivityLog from '../models/activityLogModel.js';
//import { parseISO } from 'date-fns'; // Import parseISO from date-fns

const router = express.Router();

router.get('/getevents', isAuthenticated, async (req, res) => {
  try {
    const events = await listEvents(req.user.accessToken); 

    const newEvents = await filterNewEvents(events);

    if (newEvents.length > 0) {
      await Event.insertMany(newEvents);
      console.log('New events saved to database:', newEvents);
    } else {
      console.log('No new events to save.');
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching or saving events:', error);
    res.status(500).json({ error: 'Failed to fetch or save events' });
  }
});


router.post('/createevent', isAuthenticated, async (req, res) => {
  try {
    const eventData = req.body; 
    // Default event data

    // const eventData = {
    //   summary: 'Team Meeting',
    //   location: 'Kathmandu, Nepal',
    //   description: 'Discuss project updates and next steps',
    //   start: {
    //     dateTime: new Date().toISOString(), // Start time is current time
    //     timeZone: 'Asia/Kathmandu', // Time zone is Asia/Kathmandu
    //   },
    //   end: {
    //     dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // End time is 1 hour from now
    //     timeZone: 'Asia/Kathmandu', // Time zone is Asia/Kathmandu
    //   },
    // };


    const newEvent = await createEvent(req.user.accessToken, eventData);

    const savedEvent = await Event.create(newEvent);
    const log = new ActivityLog({
      user: req.user._id,
      action: 'createevent',
      message: 'Event created successfully',
      eventId: createdEvent._id,
    });
    await log.save();
    res.json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});


router.delete('/events/:eventId', isAuthenticated, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    await deleteEvent(req.user.accessToken, eventId);
    await Event.deleteOne({ _id: eventId });
    const log = new ActivityLog({
      user: req.user._id,
      action: 'deleteevent',
      message: 'Event deleted successfully',
      eventId: eventId,
    });
    await log.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});


router.put('/events/:eventId', isAuthenticated, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const eventData = req.body; 
    const updatedEvent = await updateEvent(req.user.accessToken, eventId, eventData);
    const updatedDoc = await Event.findByIdAndUpdate(eventId, eventData, { new: true });

    const log = new ActivityLog({
      user: req.user._id,
      action: 'updateEvent',
      message: 'Event updated successfully',
      eventId: updatedEvent._id,
    });
    await log.save();
    res.json(updatedDoc);
    //res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});



async function filterNewEvents(events) {
  const eventIds = events.map(event => event.id); 
  const existingEvents = await Event.find({ id: { $in: eventIds } });

  const existingEventIds = existingEvents.map(event => event.id);
  const newEvents = events.filter(event => !existingEventIds.includes(event.id));

  return newEvents;
}

export default router;
