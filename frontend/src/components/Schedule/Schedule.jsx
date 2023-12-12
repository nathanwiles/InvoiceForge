import { React, useEffect, useState } from "react";
import AddEditModal from "./AddEditModal";
import Day from "./Day";

const Schedule = (props) => {
	const [show, setShow] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [selectedSlot, setSelectedSlot] = useState(null);

	useEffect(() => {
		if (show === false) {
			setSelectedEvent(null);
		}
	}, [show]);

	const handleClose = () => {
		setShow(false);
		setSelectedEvent(null);

	};

	return (
		<div className="fullPage">
			<AddEditModal
				selectedSlot={selectedSlot}
				selectedEvent={selectedEvent}
				user={props.user}
				show={show}
				onClose={handleClose}
			/>
			<Day
				setSelectedEvent={setSelectedEvent}
				setSelectedSlot={setSelectedSlot}
				setShow={setShow}
				show={show}
				user={props.user}
			/>
		</div>
	);
};

export default Schedule;
