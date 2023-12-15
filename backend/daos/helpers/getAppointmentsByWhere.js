const db = require('../../db/db');

/**
 * Retrieves appointments from the database based on the provided conditions.
 * If the condition includes a user_id, it retrieves appointments for the clients associated with that user.
 * If the condition does not include a user_id, it retrieves all appointments that match the query.
 * @param {Object} where - The conditions to filter the appointments.
 * @returns {Promise<Array>} - A promise that resolves to an array of appointments.
 */

module.exports = async function(where) {

  if (!!where.user_id) {
    // separate user_id from where object
    const { user_id, ...newWhere } = where;
    // retrieve client ids for user
    const clientIds = await db('clients_users').where({ user_id }).pluck('client_id');
    // generate array of unique client ids
    const uniqueClientIds = [...new Set(clientIds)];
    // retrieve appointments for each client
    const appointments = await Promise.all(uniqueClientIds.map(async (clientId) => {
      const thisWhere = { ...newWhere, client_id: clientId };
      return await db('appointments').where(thisWhere);

    }));

    // combine all appointments into one array
    const flattenedAppointments = appointments.reduce((acc, val) => acc.concat(val), []);

    return flattenedAppointments;
  } else {
    // return all appointments that match query
    const appointments = await db('appointments').where(where);
    return appointments;
  }
};
