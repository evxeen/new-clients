const express = require("express");
const { PrismaClient } = require('@prisma/client');
const { hashPassword, comparePassword, generateToken } = require('../services/auth.service');
const  authMiddleware  = require("../middleware/auth") ;

const prisma = new PrismaClient();

const router = express.Router();

// Регистрация (только админ может создавать юзеров)
router.post("/register", async (req, res) => {
    try {
        const { number, password, name, role } = req.body;

        const hashed = await hashPassword(password);

        const user = await prisma.user.create({
            data: { number, password: hashed, name, role }
        });

        res.json(user);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Логин
router.post("/login", async (req, res) => {
    const { number, password } = req.body;

    const email = number;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Неверные данные" });

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Неверные данные" });

    const token = generateToken(user);

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

// Текущий пользователь
router.get("/me", authMiddleware, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, role: true }
    });

    res.json(user);
});

module.exports = router;
