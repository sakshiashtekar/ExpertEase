import * as WebBrowser from 'expo-web-browser';

export const openGoogleCalendar = ({ title, date, time }) => {
  const startDateTime = `${date}T${time}:00`;
  const endDateTime = `${date}T${parseInt(time.split(':')[0]) + 1}:00:00`; // 1 hour duration

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDateTime.replace(/[-:]/g, '')}Z/${endDateTime.replace(/[-:]/g, '')}Z`;

  WebBrowser.openBrowserAsync(url);
};
