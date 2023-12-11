import React from "react";
import "../../styles/uninvoicedAppointments.scss";

const UninvoicedAppointmentItem = ({
  appointment,
  handleAppointmentCheck,
  isChecked,
}) => {
  return (
    <div
      className={`uninvoiced-appointment-list-item ${isChecked ? "selected" : ""}`}
      onClick={() => handleAppointmentCheck(appointment.id)}
    >
      <div className="uninvoiced-appointment-info">
        <p>📝 {appointment.notes}</p>
        <p>📆 {appointment.date}</p>
        <p>⏱ {appointment.confirmedHours} hours</p>
      </div>
    </div>
  );
};

const UninvoicedAppointments = ({
  reviewedAppointments,
  handleAppointmentCheck,
  checkedAppointments,
}) => {
  return (
    <div className="uninvoiced-appointment-list">
      {reviewedAppointments.map((appointment) => (
        <UninvoicedAppointmentItem
          key={appointment.id}
          appointment={appointment}
          handleAppointmentCheck={handleAppointmentCheck}
          isChecked={checkedAppointments.includes(appointment.id)}
        />
      ))}
    </div>
  );
};

export default UninvoicedAppointments;
