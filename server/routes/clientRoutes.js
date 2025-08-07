const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/countries', clientController.getCountries);
router.get('/regions', clientController.getRegions);
router.get('/cities', clientController.getCities);

router.get('/:id', clientController.getClientById);
router.put('/:id', clientController.updateClient);


router.get('/', clientController.getAllClients);
router.get('/leads', clientController.getLeadsTable);
router.post('/', clientController.createClient);



module.exports = router;