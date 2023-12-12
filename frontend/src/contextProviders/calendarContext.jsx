import React, { createContext, useState, useContext } from 'react';

const CalendarContext = createContext();

export const useCalendar = () => {
  return useContext(CalendarContext);
};

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [show, setShow] = useState(false);

  const value = {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    selectedSlot,
    setSelectedSlot,
    show,
    setShow,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
