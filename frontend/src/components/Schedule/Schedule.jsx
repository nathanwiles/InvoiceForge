import { React, useEffect, useState } from "react";
import AddEditModal from "./AddEditModal";
import Day from "./Day";
import { useCalendar } from "../../contextProviders/calendarContext";

const Schedule = (props) => {
	const {
		setSelectedEvent,
		show
	} = useCalendar();

	
	useEffect(() => {
		if (show === false) {
			setSelectedEvent(null);
		}
	}, [show]);

	return (
		<div className="fullPage">
			<AddEditModal
				user={props.user}
			/>
			<Day
				user={props.user}
			/>
		</div>
	);
};

export default Schedule;
