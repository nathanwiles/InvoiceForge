import { React, useEffect, useState } from "react";
import AddEditModal from "./AddEditModal";
import Calendar from "./Calendar";

const Schedule = () => {
	return (
		<section className="fullPage">
			<AddEditModal/>
			<Calendar/>
		</section>
	);
};

export default Schedule;
