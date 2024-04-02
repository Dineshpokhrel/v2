import { google } from 'googleapis';
import { oauth2Client } from './googleService.js';

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const listEvents = async (accessToken) => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });

    const res = await calendar.events.list({
      calendarId: 'primary', 
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return res.data.items;
  } catch (error) {
    console.error('Error listing events:', error);
    throw error;
  }
};

const createEvent = async (accessToken, eventData) => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });

    const res = await calendar.events.insert({
      calendarId: 'primary',
      resource: eventData,
    });

    return res.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

const deleteEvent = async (accessToken, eventId) => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });

    await calendar.events.delete({
      calendarId: 'primary', 
      eventId: eventId,
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

const updateEvent = async (accessToken, eventId, eventData) => {
  try {
    // Use oauth2Client instead of accessToken directly
    oauth2Client.setCredentials({ access_token: accessToken });
    const res = await calendar.events.update({
      calendarId: 'primary', // Use 'primary' for the primary calendar
      eventId: eventId,
      resource: eventData,
    });

    return res.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export { listEvents, createEvent, deleteEvent, updateEvent };
