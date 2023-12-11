import { React, useEffect, useState } from "react";
import "../../styles/page.scss";
import AddEditModal from "./AddEditModal";
import Day from "./Day";

const Page = (props) => {
	const [show, setShow] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	useEffect(() => {
		if (selectedEvent) {
		}
	}, [selectedEvent]);



	useEffect(() => {
		if (show === false) {
			setSelectedEvent(null);
		}
	}, [show]);

	const handleShow = () => {
		setSelectedEvent(null);
		setShow(true);
	};

	const handleClose = () => {
		setShow(false);
		setSelectedEvent(null);

	};

	return (
		<div className="fullPage">
			<AddEditModal
				selectedEvent={selectedEvent}
				user={props.user}
				show={show}
				onClose={handleClose}
			/>
			<Day
				setSelectedEvent={setSelectedEvent}
				setShow={setShow}
				show={show}
				user={props.user}
			/>
			<button id="floating-add-button" onClick={handleShow}>
				Add Appoinment
			</button>
		</div>
	);
};

export default Page;
