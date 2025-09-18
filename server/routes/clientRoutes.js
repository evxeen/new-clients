const express = require('express');
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const clientController = require('../controllers/clientController');
const  authMiddleware  = require("../middleware/auth") ;

const prisma = new PrismaClient();


router.get("/", authMiddleware, async (req, res) => {
    try {
        let clients;

        if (req.user.role === "ADMIN" || req.user.role === "SUPERMANAGER") {
            // видят всех
            const clients = await prisma.client.findMany({
                include: {
                    managerUser: true  // relation, можно включить
                }
            })
            res.json(clients);
        } else if (req.user.role === "MANAGER") {
            // видят только своих
            clients = await prisma.client.findMany({
                where: { managerId: req.user.id },
                // include: { history: true, mainStatus: true }
                include: {
                    managerUser: true  // relation, можно включить
                }
            });
            res.json(clients);

        } else {
            return res.status(403).json({ error: "Нет доступа" });
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get('/countries', clientController.getCountries);
router.get('/regions', clientController.getRegions);
router.get('/cities', clientController.getCities);
router.get('/leads', clientController.getLeadsTable);

router.get('/:id', clientController.getClientById);
router.put('/:id', clientController.updateClient);
router.post('/:id/history', clientController.addHistoryItem);
router.put('/:id/main-status', clientController.updateMainStatus);

// router.get('/', clientController.getAllClients);
// routes/clients.js

// список клиентов



router.post('/', clientController.createClient);

module.exports = router;