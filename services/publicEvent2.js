import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath for converting import.meta.url

function readJsonFile(filePath) {
  try {
    const fileData = fs.readFileSync(filePath);
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return null;
  }
}

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function extractMonthData(monthData) {
  const processedData = [];

  monthData.forEach(dayData => {
    const { day, week_day, ad, AD_date, events } = dayData;
    if (!AD_date || !events) {
      console.error('Invalid day data:', dayData);
      return; // Skip this day if data is invalid or missing
    }

    // Extract necessary fields from ad_date
    const { bs, chandrama, tithi } = AD_date;

    // Filter events based on holiday status
    let selectedEvent = null;
    const filteredEvents = events.filter(event => event.holiday_status === 1);
    if (filteredEvents.length > 0) {
      // If any event has holiday status 1, prioritize it
      selectedEvent = filteredEvents[0]; // Get the first event with holiday status 1
    } else {
      // If no event has holiday status 1, but events exist, select the first event
      selectedEvent = events.length > 0 ? events[0] : null;
    }

    // Extract data from the selected event
    const eventData = selectedEvent ? {
      jlt: selectedEvent.jtl || '', // Handle missing jtl property
      ne: (selectedEvent.jds && selectedEvent.jds.ne) || '' // Check if jds and ne exist
    } : null;

    // Format extracted data including holiday status
    const formattedData = {
      day,
      week_day,
      ad,
      bs,
      chandrama,
      tithi,
      selectedEvent: eventData,
      isHoliday: selectedEvent ? selectedEvent.holiday_status : 0 // Set holiday status based on selectedEvent's holiday_status
    };

    processedData.push(formattedData);
  });

  return processedData;
}

// Function to get data for a specific month and year
function getDataForMonth(year, month) {
    const filePath = path.join(__dirname, '..', 'public', 'data', `${year}-calendar.json`);
    console.log('File path:', filePath); // Debugging: Log file path
    const jsonData = readJsonFile(filePath);
    //console.log('Loaded JSON data:', jsonData); // Debugging: Log loaded JSON data
  
    if (!jsonData) {
      throw new Error('Failed to load JSON data from file.');
    }
  
    if (!jsonData[month]) {
      console.error(`Month ${month} data not found in JSON.`);
      console.log('Available months:', Object.keys(jsonData)); // Debugging: Log available months
      throw new Error(`Data not found for year ${year} and month ${month}.`);
    }
  
    //console.log('Month data:', jsonData[month]); // Debugging: Log specific month data
  
    return extractMonthData(jsonData[month]);
}
  



// Function to get data for a specific day, month, and year
function getDataForDay(year, month, day) {
  // Load the JSON data directly for the specified month
  const monthData = readJsonFile(path.join(__dirname, '..', 'public', 'data', `${year}-calendar.json`))[month];

  if (!monthData) {
    throw new Error(`Month ${month} data not found in JSON.`);
  }

  // Find the specific day's data
  const dayData = monthData.find(data => data.day === day);

  if (!dayData) {
    throw new Error(`Data not found for year ${year}, month ${month}, and day ${day}.`);
  }

 // Extract necessary fields for the day
 const dayInfo = {
  day: dayData.day,
  ad: dayData.ad,
  bs: dayData.AD_date.bs,
  chandrama: dayData.AD_date.chandrama,
  tithi: dayData.AD_date.tithi
};

// Initialize isHoliday flag
let isHoliday = null;

// Extract all events for the day and check for holiday status 1
const allEvents = dayData.events.map(event => {
  const eventData = {
    jlt: event.jtl || '',
    ne: (event.jds && event.jds.ne) || ''
  };

  if (event.holiday_status === 1 && isHoliday === null) {
    isHoliday = 1;
  }

  return eventData;
});

// Combine day info and isHoliday flag in the result
const result = {
  dayInfo,
  allEvents,
  isHoliday
};

return result;
}




// function getDataForDay(year, month, day) {
//   const monthData = getDataForMonth(year, month);
//   const dayData = monthData.find(data => data.day=== day);

//   if (!dayData) {
//     throw new Error(`Data not found for year ${year}, month ${month}, and day ${day}.`);
//   }
//   const { events } = dayData;
//   return { dayData, allEvents: events };
// }

export { extractMonthData, getDataForMonth, getDataForDay };
