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

const Day = ({user}) => {
  const { showAlert } = useAlertModal();
  const {
    events,
    setEvents,
		showAddEditModal,
  } = useCalendar();

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

	const adjustEvent = ({event, start, end}) => {
		const idx = events.indexOf(event);
		let updatedEvent = { ...event, start, end };
		const date = moment(start).format('YYYY-MM-DD');
		const startTime = moment(start).format('HH:mm:SS');
		const endTime = moment(end).format('HH:mm:SS');
		return handleAppointmentUpdate({ date, startTime, endTime }, updatedEvent.appointment)
			.then((appointment) => {
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
	const handleSelectedEvent = (event) => {
		showAddEditModal({event});
	};



	const minTime = new Date();
	minTime.setHours(5, 30, 0);
	const maxTime = new Date();
	maxTime.setHours(20, 30, 0);

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
				onSelectEvent={handleSelectedEvent}
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

export default Day;
