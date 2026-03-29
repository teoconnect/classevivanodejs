import express from 'express';
import pkg from 'classeviva.js';
const { Rest } = pkg;
import ical from 'ical-generator';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const CV_USERNAME = process.env.CV_USERNAME;
const CV_PASSWORD = process.env.CV_PASSWORD;

if (!CV_USERNAME || !CV_PASSWORD) {
  console.error('Error: CV_USERNAME and CV_PASSWORD must be set in .env');
  process.exit(1);
}

// Function to calculate start and end dates for the current school year
function getSchoolYearDates() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based, so September is 8

  let startYear, endYear;
  if (month >= 8) { // September or later
    startYear = year;
    endYear = year + 1;
  } else { // Before September
    startYear = year - 1;
    endYear = year;
  }

  // School year: Sept 1st to August 31st
  const start = new Date(startYear, 8, 1);
  const end = new Date(endYear, 7, 31, 23, 59, 59);

  return { start, end };
}

app.get('/agenda.ics', async (req, res) => {
  try {
    const cv = new Rest();

    // Login to Classeviva
    await cv.login(CV_USERNAME, CV_PASSWORD);

    const { start, end } = getSchoolYearDates();

    // Fetch agenda items
    const agendaItems = await cv.getAgenda('all', start, end);

    // Create a new calendar
    const calendar = ical({
      name: 'Classeviva Agenda',
      description: 'Agenda scolastica sincronizzata da Classeviva',
      timezone: 'Europe/Rome' // Adjust timezone if needed
    });

    if (Array.isArray(agendaItems)) {
      agendaItems.forEach(item => {
        // Parse dates. They come as strings like "2023-09-12 08:00:00" or similar, or full ISO strings depending on the API
        const beginDate = new Date(item.evtDatetimeBegin);
        const endDate = new Date(item.evtDatetimeEnd);

        // Subject or class desc
        const subject = item.subjectDesc ? `[${item.subjectDesc}] ` : '';
        const author = item.authorName ? ` (${item.authorName})` : '';

        // Some notes might be in HTML or just plain text
        let description = item.notes || '';

        calendar.createEvent({
          start: beginDate,
          end: endDate,
          summary: `${subject}${item.notes ? item.notes.substring(0, 50) + (item.notes.length > 50 ? '...' : '') : 'Impegno in agenda'}`,
          description: description + author,
          allDay: item.isFullDay
        });
      });
    }

    // Serve the calendar file
    calendar.serve(res);

  } catch (error) {
    console.error('Error fetching data from Classeviva:', error);
    res.status(500).send('Internal Server Error while generating the calendar feed.');
  }
});

app.listen(port, () => {
  console.log(`Classeviva iCal server is running on http://localhost:${port}`);
  console.log(`Add this URL to Google Calendar to subscribe: http://localhost:${port}/agenda.ics`);
});
