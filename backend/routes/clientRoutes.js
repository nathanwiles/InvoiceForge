const clientController = require('../controllers/client');
const express = require('express');
const router = express.Router();
const validateDto = require('../middleware/validate-dto');
const clientDto = require('../dtos/client');


// GET /api/client/:id - serves object - client
router.get('/:id', (req, res) => {
  clientController.getById(req, res);
});

// PUT /api/client/:id/address - adds address_id to client
router.put('/:id/address/:addressId', (req, res) => {
  clientController.setAddressId(req, res);
});
// PUTS /api/client/:id
router.put('/:id', validateDto(clientDto), (req, res) => {
  clientController.update(req, res);
});
// POST /api/client/ - takes params for new client
router.post('/', validateDto(clientDto), (req, res) => {
  clientController.create(req, res);
});

module.exports = router;
