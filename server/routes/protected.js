const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireAnyRole, requireRole } = require('../middleware/roles');

// Маршрут для руководителя и админа
router.get('/analytics', auth, requireAnyRole('LEAD', 'ADMIN'), (req, res) => {
    res.json({ msg: `Analytics for ${req.user.role}` });
});

// Маршрут только для менеджера — будет видеть только своих клиентов
router.get('/my-clients', auth, requireRole('MANAGER'), (req, res) => {
// Здесь ты реализуешь логику: clients where ownerId = req.user.id
    res.json({ msg: `Clients for manager ${req.user.id}` });
});

module.exports = router;