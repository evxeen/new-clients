const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');


// Создать пользователя (ADMIN)
router.post('/', auth, requireRole('ADMIN'), async (req, res) => {
    const { email, password, name, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ error: 'email, password, role required' });


    const hashed = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({ data: { email, password: hashed, name, role } });
        res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
    } catch (err) {
        res.status(400).json({ error: 'Cannot create user', details: err.message });
    }
});


// Получить список всех пользователей (ADMIN)
router.get('/', auth, requireRole('ADMIN'), async (req, res) => {
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
    res.json(users);
});

// Получить все СВОИХ клиентов



module.exports = router;