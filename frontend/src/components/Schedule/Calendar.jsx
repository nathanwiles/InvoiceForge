import React, { useEffect } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { useAlertModal } from "../../contextProviders/useAlertModalContext";
import { useCalendar } from '../../contextProviders/calendarContext';
import requests from "../../api/requests";
import "../../styles/day.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default () => {
  const { showAlert } = useAlertModal();
  const {
    events,
    setEvents,
		showAddEditModal,
  } = useCalendar();

	// handles updating the appointment in the database
	const handleAppointmentUpdate = (newData, appointment) => {
		const updatedAppointment = { ...appointment, ...newData };
		return requests.update.appointment(appointment.id, updatedAppointment).then(() => updatedAppointment)
			.catch((err) => {
				showAlert({
					title: "Can't do it",
					message: "There was an error updating your appointment. Please try again later."
				});
				console.error(err);
			});
	};

	// handles updating the event when it is dragged or resized
	const adjustEvent = ({event, start, end}) => {
		const idx = events.indexOf(event);
		// create a new event with the updated start and end times
		let updatedEvent = { ...event, start, end };

		// define the date, startTime, and endTime to be sent to the server
		const date = moment(start).format('YYYY-MM-DD');
		const startTime = moment(start).format('HH:mm:SS');
		const endTime = moment(end).format('HH:mm:SS');

		// update the appointment in the database
		return handleAppointmentUpdate({ date, startTime, endTime }, updatedEvent.appointment)
			.then((appointment) => {
				// update the event in the events array
				updatedEvent = { ...updatedEvent, appointment };
				const updatedEvents = [...events];
				updatedEvents.splice(idx, 1, updatedEvent);
				setEvents(updatedEvents);
			});
	};


	const handleSelectSlot = (slotInfo) => {
		let { date, start, end } = slotInfo;
		date = moment(date).format('YYYY-MM-DD');
		const startTime = moment(start).format('HH:mm:SS');
		const endTime = moment(end).format('HH:mm:SS');
		const slot ={ startTime, endTime, date };
		showAddEditModal({slot});
	};

	// opens the modal with the selected event
	const handleSelectEvent = (event) => {
		showAddEditModal({event});
	};

	const minTime = new Date();
	minTime.setHours(5, 0, 0);
	const maxTime = new Date();
	maxTime.setHours(21, 0, 0);

	return (
		<div className="myCustomHeight" style={{ height: "80vh" }}>
			<DnDCalendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				defaultView="week"
				views={["month", "week", "day"]}
				min={minTime}
				max={maxTime}
				onSelectEvent={handleSelectEvent}
				selectable={true}
				onSelectSlot={handleSelectSlot}
				showMultiDayTimes={true}
				onEventDrop={adjustEvent}
				onEventResize={adjustEvent}
				resizable={true}
				draggable={true}
				style={{ height: "80vh" }}
			/>
		</div>
	);
};
