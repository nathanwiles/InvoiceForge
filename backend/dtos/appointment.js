const yup = require('yup');
moment = require('moment');
moment().format();

module.exports = yup.object().shape({
  invoiceId: yup.number().integer().positive().nullable().default(null),
  id: yup.number().integer().positive(),
  clientId: yup.number().integer().positive(),
  date: yup.date().required(),
  startTime: yup.string().required(),
  endTime: yup.string()
    .required()
    .test('end-is-after-start-time', "Cannot end before starting", function(value) {
      const { startTime } = this.parent;
      return moment(value, 'HH:mm a').isSameOrAfter(moment(startTime, 'HH:mm a').add(1, 'hours'));
    }),
  confirmedHours: yup.number().integer().positive().nullable().default(null),
  reviewed: yup.boolean().required().default(false),
  invoiced: yup.boolean().required().default(false),
  appointmentRateCents: yup.number().transform((value, originalValue) => { String(originalValue).trim() == "" ? null : value; }).integer().positive().nullable().default(null),
  notes: yup.string().nullable().default(null)
})
  .test('id-clientId', 'must have either an id or a clientId', function(value) {
    console.log(value);
    return !!(value.id || value.clientId);
  });
