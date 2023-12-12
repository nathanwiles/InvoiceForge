import React, { useEffect, useState } from "react";
import "../../styles/day.scss";
import requests from "../../api/requests";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useAlertModal } from "../../contextProviders/useAlertModalContext";

const localizer = momentLocalizer(moment);

const Day = (props) => {
	const { setShow, show, setSelectedSlot } = props;
	const setSelectedEvent = props.setSelectedEvent;
	const { showAlert } = useAlertModal();
	const DnDCalendar = withDragAndDrop(Calendar);

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

	const handleEventDrop = ({ event, start, end }) => {
		const idx = events.indexOf(event);
		let updatedEvent = { ...event, start, end };
		console.log("event", updatedEvent);
		const date = moment(start).format('YYYY-MM-DD');
		const startTime = moment(start).format('HH:mm:SS');
		const endTime = moment(end).format('HH:mm:SS');
		handleAppointmentUpdate({ date, startTime, endTime }, updatedEvent.appointment)
			.then((appointment) => {
				updatedEvent = { ...updatedEvent, appointment };
				const updatedEvents = [...events];
				updatedEvents.splice(idx, 1, updatedEvent);
				setevents(updatedEvents);
			});

		const nextEvents = [...events];
		nextEvents.splice(idx, 1, updatedEvent);
		setevents(nextEvents);
	};

	const handleEventResize = ({ event, start, end }) => {
		const idx = events.indexOf(event);
		let updatedEvent = { ...event, start, end };
		const date = moment(start).format('YYYY-MM-DD');
		const startTime = moment(start).format('HH:mm:SS');
		const endTime = moment(end).format('HH:mm:SS');
		handleAppointmentUpdate({ date, startTime, endTime }, updatedEvent.appointment)
			.then((appointment) => {
				updatedEvent = { ...updatedEvent, appointment };
				const updatedEvents = [...events];
				updatedEvents.splice(idx, 1, updatedEvent);
				setevents(updatedEvents);
			});
	};

	const handleSelectSlot = (slotInfo) => {
		let { date, start: startTime, end: endTime } = slotInfo;
		date = moment(date).format('YYYY-MM-DD');
		startTime = moment(startTime).format('HH:mm:SS');
		endTime = moment(endTime).format('HH:mm:SS');
		setSelectedSlot({ startTime, endTime, date });
		setShow(true);
	};

	const [events, setevents] = useState([]);

	useEffect(() => {
		if (!show) setSelectedEvent(null);
		const fetchData = async () => {
			try {
				const appointments = await requests.get.user(props.user.id)
					.appointments;
				const sortedEvents = appointments.map((app) => {
					return {
						start: moment(`${app.date}T${app.startTime}`).toDate(),
						end: moment(`${app.date}T${app.endTime}`).toDate(),
						title: app.client.name,
						id: app.id,
						appointment: { ...app }
					};
				});

				setevents(sortedEvents);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [show]);

	//function to handle edit
	const handleSelectedEvent = (event) => {
		setSelectedEvent(event);
		setShow(true);
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
				onEventDrop={handleEventDrop}
				onEventResize={handleEventResize}
				resizable={true}
				draggable={true}
				style={{ height: "80vh" }}
			/>
		</div>
	);
};

export default Day;
