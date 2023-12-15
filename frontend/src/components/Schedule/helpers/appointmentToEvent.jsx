import moment from 'moment';

export default (appointment) => {
  return {
    start: moment(`${appointment.date}T${appointment.startTime}`).toDate(),
    end: moment(`${appointment.date}T${appointment.endTime}`).toDate(),
    title: appointment.client.name,
    id: appointment.id,
    appointment: { ...appointment }
  };
};
