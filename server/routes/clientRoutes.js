const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.post('/', clientController.createClient);
router.put('/:id', clientController.updateClient);
router.put('/:id/main-status', clientController.mainStatusClient);
router.post('/:id/history', clientController.addHistoryItem);
router.put('/:id/main-contact', clientController.updateMainContact);
router.post('/:id/contacts', clientController.addContact);

module.exports = router;