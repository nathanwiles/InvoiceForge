const db = require('../db/db');
const { replacePropertyWithinObject } = require('./helpers');
const humps = require('humps');
class appointmentDao {
  async create(date, startTime, endTime, clientId, appointmentRateCents, notes) {
    try {
      const [id] = await db('appointments').insert({
        date,
        start_time: startTime,
        end_time: endTime,
        client_id: clientId,
        appointment_rate_cents: appointmentRateCents,
        notes
      })
        .returning('id');

      return id;
    } catch (e) {

    }
  }

  async getById(id) {
    let appointment = await db('appointments').select('*').where({ id }).first();
    appointment = await replacePropertyWithinObject('client', appointment, 'appointment');
    appointment.client = await replacePropertyWithinObject('address', appointment.client);
    return humps.camelizeKeys(appointment);
  }

  async delete(id) {
    return await db('appointments').where({ id }).del();
  }

  async edit({id, date, startTime, endTime, appointmentRateCents, notes, confirmedHours}) {

    return await db('appointments').where({ id }).update({
      date,
      start_time: startTime,
      end_time: endTime,
      appointment_rate_cents: appointmentRateCents,
      notes
    });
  }
  async confirmHours(id, confirmedHours) {
    return await db('appointments').where({ id }).update({ confirmed_hours: confirmedHours, reviewed: true, invoiced: false });
  }
}

module.exports = new appointmentDao();
