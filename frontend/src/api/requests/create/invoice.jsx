import create from '../helpers/create';

/**
 * Creates an invoice for the given appointment IDs.
 * @param {Array<number>} appointmentIds - The array of appointment IDs to include in the invoice.
 * @returns {Promise} A promise that resolves with the created invoice.
 */
export default (appointmentIds) => {
  return create('/api/invoice', appointmentIds);
};
