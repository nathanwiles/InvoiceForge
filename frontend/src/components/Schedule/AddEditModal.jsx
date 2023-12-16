import React, { useEffect, useState } from "react";
import "../../styles/addEditModal.scss";
import requests from "../../api/requests";
import { Modal, Button } from "react-bootstrap";
import { useAlertModal } from "../../contextProviders/useAlertModalContext";
import { useCalendar } from "../../contextProviders/calendarContext";
import { useClients } from "../../contextProviders/clientsContext";
import appointmentToEvent from "./helpers/appointmentToEvent";
import moment from "moment";


function AddEditModal() {
	const {
		selectedEvent,
		show,
		hide,
		selectedSlot,
		events,
		setEvents,
	} = useCalendar();

	const validateForm = (formData) => {
		let endsAfterStart = false;
		if (formData.startTime && formData.endTime) {
			endsAfterStart = moment(formData.startTime, "HH:mm").isBefore(moment(formData.endTime, "HH:mm"));
		}
		let isValid = false;
		const invalidFields = [];

		if (!formData.clientId) {
			invalidFields.push("client");
		}
		if (!formData.date) {
			invalidFields.push("date");
		}
		if (!formData.startTime) {
			invalidFields.push("start time");
		}
		if (!formData.endTime) {
			invalidFields.push("end time");
		}
		if (!endsAfterStart) {
			invalidFields.push("end time must be after start time");
		}
		if (formData.clientId && formData.date && formData.startTime && formData.endTime && formData.endsAfterStart) {
			isValid = true;
		}

		//package invalid field to html list
		if (invalidFields.length > 0) {
			// render invalid fields as an unordered html list
			const renderInvalidFields = (invalidFields) => {
				return (
					<>
						<h2>Invalid Fields </h2>
						<ul>
							{invalidFields.map((field) => <li>{field}</li>)}
						</ul>
					</>
				);
			};

				const message = renderInvalidFields(invalidFields);

				return { isValid, message };
		};
	};
	const defaultFormData = {
		clientId: "",
		clientName: "",
		date: "",
		startTime: "",
		endTime: "",
		appointmentRate: 0,
		notes: "",
	};
	const [formData, setFormData] = useState(defaultFormData);
	const { showAlert } = useAlertModal();
	const { clients } = useClients();

	useEffect(() => {
		if (selectedEvent) {
			const editFormData = processSelectedEvent(selectedEvent);
			setFormData(editFormData);

		} else if (selectedSlot) {
			const newFormData = processSelectedSlot(selectedSlot);
			setFormData(newFormData);

		} else {
			setFormData(defaultFormData);
		}
	}, [show]);

	const processSelectedSlot = (selectedSlot) => {
		let { date, startTime, endTime } = selectedSlot;
		if (startTime === endTime) {
			startTime = "";
			endTime = "";
		}
		const newFormData = {
			...defaultFormData,
			date: date || '',
			startTime: startTime || '',
			endTime: endTime || '',
		};
		return newFormData;
	};

	const processSelectedEvent = (selectedEvent) => {
		let eventData = selectedEvent.appointment;
		const { client, ...editEventData } = eventData;
		const { id: clientId, name: clientName } = client;
		const formData = {
			...defaultFormData,
			...editEventData,
			appointmentRate: eventData.appointmentRateCents / 100 || 0,
			clientId,
			clientName
		};
		return formData;
	};

	const handleChange = (event) => {
		const type = event.target.type;
		const name = event.target.name;

		const value =
			type === "checkbox" ? event.target.checked : event.target.value;


		if (name === "clientId") {
			const selectedClient = clients.find(
				(client) => client.id === parseInt(value)
			);
			setFormData((formData) => ({
				...formData,
				clientId: selectedClient ? selectedClient.id : '',
				clientName: selectedClient ? selectedClient.name : '',
			}));
		} else {
			setFormData((formData) => ({
				...formData,
				[name]: value,
			}));
		}
	};

	const updateLocalEvents = (updatedEvent) => {
		const updatedEvents = [...events];
		const idx = updatedEvents.findIndex(
			(event) => event.id === updatedEvent.id
		);
		updatedEvents.splice(idx, 1, updatedEvent);
		setEvents(updatedEvents);
	};

	const handleSubmit = (formData) => {
		const { isValid, message } = validateForm(formData);
		if (!isValid) {
			showAlert({ title: "Nope", message });
			return;
		}
		requests.create.appointment(formData)
			.then((appointment) => {
				const event = appointmentToEvent(appointment);
				updateLocalEvents(event);
				hide();
				showAlert({ title: "Success", message: "Appointment created" });
			})
			.catch(() => {
				showAlert({ title: "Nope", message: "Error sending data" });
			});
	};


	const handleEdit = async (formData) => {
		const { isValid, message } = validateForm(formData);
		if (!isValid) {
			showAlert({ title: "Nope", message });
			return;
		}

		const { id, clientId, date, startTime, endTime, appointmentRateCents, notes } = formData;
		const appointmentData = { clientId, date, startTime, endTime, appointmentRateCents, notes };

		// configure PUT request
		const url = `/api/appointment/${id}`;
		const reqOptions = {
			method: "PUT",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(appointmentData),
		};

		fetch(url, reqOptions).then((res) => res.json()).then((appointment) => {
			console.log("appointment updated", appointment);
			const updatedEvent = appointmentToEvent(appointment);
			updateLocalEvents(updatedEvent);
			showAlert({ title: "Success", message: "Updated successfully" });
		})
			.catch((error) => {
				showAlert({ title: "Nope", message: "Error sending data" });
				console.error("appointment not updated", error);
			});
		hide();
	};

	const handleDeleteAppointment = async (event) => {
		event.preventDefault();
		try {
			const appointmentId = selectedEvent.appointment.id;
			const url = `/api/appointment/${appointmentId}`;
			await fetch(url, {
				method: "DELETE",
				headers: { "content-type": "application/json" },
			});
			const updatedEvents = events.filter(
				(event) => event.id !== appointmentId
			);
			setEvents(updatedEvents);
			showAlert({ title: "Success", message: "Appointment deleted" });
		} catch (error) {
			console.error("appointment not deleted", error);
		}
		hide();
	};

	return (
		<>
			<Modal
				show={show}
				onHide={hide}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>{selectedEvent ? (
						<h2>Edit an appointment</h2>
					) : (
						<h2>Book an Appointment</h2>
					)}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="addEditModal">
						<form className="form">
							<label>Client Name:</label>
							<select
								name="clientId"
								value={formData.clientId}
								onChange={handleChange}
								type="text"
							>
								{!formData.clientId && (
									<option value="" disabled defaultValue>
										Pick a client
									</option>
								)}
								{clients.map((client) => (
									<option
										key={client.id}
										value={client.id}
									>
										{client.name}
									</option>
								))}
							</select>

							<label>Date:</label>
							<input
								type="date"
								name="date"
								value={formData.date}
								onChange={handleChange}
							/>
							<label>Start Time:</label>
							<input
								type="time"
								name="startTime"
								value={formData.startTime}
								onChange={handleChange}
							/>
							<label>End Time:</label>
							<input
								type="time"
								name="endTime"
								value={formData.endTime}
								onChange={handleChange}
							/>
							<label>Appointment Rate ($):</label>
							<input
								type="number"
								step={5}
								name="appointmentRate"
								value={formData.appointmentRate}
								onChange={handleChange}
							/>
							<label>Notes:</label>
							<textarea
								name="notes"
								value={formData.notes}
								onChange={handleChange}
							/>
							<br />
						</form>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						onClick={selectedEvent ? () => handleEdit(formData) : () => handleSubmit(formData)}
						id="edit-appointment-button"
					>
						Save Appointment
					</Button>
					{selectedEvent && (
						<Button variant="danger"
							onClick={handleDeleteAppointment}
						>
							Delete Appointment
						</Button>
					)}
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default AddEditModal;
