import React, { createContext, useState, useContext, useEffect } from 'react';
import requests from '../api/requests';
import { useAlertModal } from './useAlertModalContext';
import { useUserContext } from './useUserContext';
import appointmentToEvent from '../components/Schedule/helpers/appointmentToEvent';

const CalendarContext = createContext();

export const useCalendar = () => {
  return useContext(CalendarContext);
};

export const CalendarProvider = ({ children }) => {

  // Contexts
  const { showAlert } = useAlertModal();
  const { user } = useUserContext();

  // State management
  const userId = user ? user.id : null;
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [show, setShow] = useState(false);

  // handle showing the add/edit modal
  const showAddEditModal = ({event, slot}) => {
    // if event is passed in, set selectedEvent before showing modal
    if (event) setSelectedEvent(event);
    if (slot) setSelectedSlot(slot);
    setShow(true);
  };
  const hide = () => {
    setShow(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  // handle fetching events on login
  useEffect(() => {
    if (!userId) {
      setEvents([]); // clear events if no user
      return;
    }
    // fetch events
    requests.get.user(userId).appointments.then((appointments) => {
      const events = appointments.map(appointment => appointmentToEvent(appointment));
      setEvents(events);
    })
      .catch((error) => { // show Alert if error
        showAlert({
          title: "Can't do it",
          message: "There was an error fetching your appointments. Please try again later."
        });
        console.error(error);
      });
  }, [userId]);


  const value = {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    selectedSlot,
    setSelectedSlot,
    showAddEditModal,
    show,
    hide,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
