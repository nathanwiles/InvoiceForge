import React, { useEffect, useState } from "react";
import "../../styles/day.scss";
import requests from "../../api/requests";
import { Calendar, momentLocalizer, DateLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Day = (props) => {
	const { setShow, show } = props;
	const setSelectedEvent = props.setSelectedEvent;

	const [events, setevents] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const appointments = await requests.get.user(props.user.id)
					.appointments;
				const sortedEvents = [];
				// const clients = await requests.get.user(props.user.id).clients;


				const appointmentEvents = appointments.map((app) => {
					const evt = {
						start: moment(`${app.date}T${app.startTime}`).toDate(),
						end: moment(`${app.date}T${app.endTime}`).toDate(),
						title: app.notes,
						id: app.id,
						appointment: { ...app }
					};
					sortedEvents.push(evt);
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
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				defaultView="week"
				views={["month", "week", "day"]}
				min={minTime}
				max={maxTime}
				onSelectEvent={handleSelectedEvent}

			/>
		</div>
	);
};

export default Day;
