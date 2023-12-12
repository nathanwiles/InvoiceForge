import React, { useEffect, useState } from "react";
import "../../styles/addEditModal.scss";
import requests from "../../api/requests";
import { Modal, Button } from "react-bootstrap";
import { useAlertModal } from "../../contextProviders/useAlertModalContext";
import appointment from "../../api/requests/create/appointment";



/**
 * AddEditModal component for creating or editing appointments.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Flag indicating whether the modal is visible.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Object} props.selectedSlot - The selected time slot for creating a new appointment.
 * @param {Object} props.selectedEvent - The selected event for editing an existing appointment.
 * @param {Object} props.user - The user object.
 * @returns {JSX.Element} The AddEditModal component.
 */
function AddEditModal(props) {
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
	const { show, onClose, selectedSlot, selectedEvent, user } = props;

	useEffect(() => {
		if (selectedEvent) {
			const eventData = selectedEvent.appointment;
			const { client, ...eventdata } = eventData;
			const { id: clientId, name: clientName } = client;
			const editFormData = {
				...defaultFormData,
				...eventData,
				appointmentRate: eventData.appointmentRateCents / 100 || 0,
				clientId,
				clientName
			};
			setFormData(editFormData);
		} else if (selectedSlot) {
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
			setFormData(newFormData);
		} else {
			setFormData(defaultFormData);
		}
	}, [show]);

	const [clients, setClients] = useState([]);

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

	useEffect(() => {
		requests.get.user(props.user.id).clients.then((clients) => {
			setClients(clients);
		});
	}, [props.user]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await requests.create.appointment(formData);

			// Close the modal
			props.onClose();
			showAlert({ title: "Success", message: "Appointment created" });
		} catch (error) {
			console.error("Error sending data", error);
		}
	};

	const handleEdit = async (event) => {
		event.preventDefault();
		const { id: appointmentId, client } = selectedEvent.appointment;
		const { id: clientId } = client;
		const editedAppointment = {
			...formData,
			clientId
		};
		try {
			const url = `/api/appointment/${appointmentId}`;
			const reqOptions = {
				method: "PUT",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(editedAppointment),
			};
			fetch(url, reqOptions);
			showAlert({ title: "Success", message: "Updated successfully" });
		} catch (error) {
			console.error("Error sending data", error);
		}
		props.onClose();
	};

	const handleDeleteAppointment = async (event) => {
		event.preventDefault();
		try {
			const appointmentId = selectedEvent.appointment.id;
			const url = `/api/appointment/${appointmentId}`;
			fetch(url, {
				method: "DELETE",
				headers: { "content-type": "application/json" },
			});
			showAlert({ title: "Success", message: "Appointment deleted" });
		} catch (error) {
			console.error("appointment not deleted", error);
		}
		props.onClose();
	};

	return (
		<>
			<Modal
				show={show}
				onHide={() => onClose()}
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
						type="submit"
						onClick={selectedEvent ? handleEdit : handleSubmit}
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
}

export default AddEditModal;
