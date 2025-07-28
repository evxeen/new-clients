const clientModel = require('../models/clientModel');
const { getCurrentFormattedDate } = require('../utils/dateUtils');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();



module.exports = {
     getAllClients: async (req, res) => {
        try {
            const clients = await prisma.client.findMany();
            res.json(clients);
        } catch (error) {
            console.error('Ошибка при получении клиентов:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },

     getClientById: async (req, res) => {
        const id = Number(req.params.id);

        try {
            const client = await prisma.client.findUnique({
                where: { id },
            });

            if (!client) {
                return res.status(404).json({ error: 'Клиент не найден' });
            }

            res.json(client);
        } catch (error) {
            console.error('Ошибка при получении клиента:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },

    createClient: async (req, res) => {
        try {
            const data = req.body;

            const newClient = await prisma.client.create({
                data: {
                            id: Date.now(),
                            mainStatus: {active: ''},
                            createDate: getCurrentFormattedDate(),
                            ...req.body,
                            address: '',
                            suppliers: [],
                            contacts: [],
                            history: []
                        }
            });

            res.status(201).json(newClient);
        } catch (error) {
            console.error('Ошибка при создании клиента:', error);
            res.status(500).json({ error: 'Ошибка сервера при создании клиента' });
        }
    },

    updateMainStatus: async (req, res) => {
        const id = Number(req.params.id); // приведение ID к числу
        const newMainStatus = req.body;

        try {
            const updatedClient = await prisma.client.update({
                where: { id },
                data: {
                    mainStatus: newMainStatus
                }
            });

            res.json(updatedClient);
        } catch (error) {
            console.error('Ошибка при обновлении mainStatus:', error);
            res.status(500).json({ error: 'Ошибка при обновлении статуса клиента' });
        }
    },

    addHistoryItem: async (req, res) => {
        const id = Number(req.params.id);
        const newEntry = req.body;

        try {
            // Получаем текущую историю
            const client = await prisma.client.findUnique({
                where: { id },
                select: { history: true }
            });

            if (!client) {
                return res.status(404).json({ error: 'Клиент не найден' });
            }

            const updatedHistory = [...(client.history || []), newEntry];

            const updatedClient = await prisma.client.update({
                where: { id },
                data: { history: updatedHistory }
            });

            res.json(updatedClient);
        } catch (error) {
            console.error('Ошибка при добавлении записи в историю:', error);
            res.status(500).json({ error: 'Ошибка при добавлении записи в историю' });
        }
    },

    addContact: async (req, res) => {
        const id = Number(req.params.id);
        const newContact = req.body;

        try {
            const client = await prisma.client.findUnique({
                where: { id },
                select: { contacts: true }
            });

            if (!client) {
                return res.status(404).json({ error: 'Клиент не найден' });
            }

            const updatedContacts = [...(client.contacts || []), newContact];

            const updatedClient = await prisma.client.update({
                where: { id },
                data: { contacts: updatedContacts }
            });

            res.json(updatedClient);
        } catch (error) {
            console.error('Ошибка при добавлении контакта:', error);
            res.status(500).json({ error: 'Ошибка при добавлении контакта' });
        }
    },

    updateClient: async (req, res) => {
        const id = Number(req.params.id);
        const data = req.body;

        try {
            const updatedClient = await prisma.client.update({
                where: { id },
                data
            });

            res.json(updatedClient);
        } catch (err) {
            console.error('Ошибка при обновлении клиента:', err);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },

    updateMainContact: async (req, res) => {
        const id = Number(req.params.id);
        const { mainIndex } = req.body;

        try {
            const client = await prisma.client.findUnique({
                where: { id },
                select: { contacts: true }
            });

            if (!client) {
                return res.status(404).json({ error: 'Клиент не найден' });
            }

            const updatedContacts = client.contacts.map((contact, index) => ({
                ...contact,
                isMain: index === mainIndex
            }));

            const updatedClient = await prisma.client.update({
                where: { id },
                data: { contacts: updatedContacts }
            });

            res.json(updatedClient);
        } catch (err) {
            console.error('Ошибка при обновлении основного контакта:', err);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },



    // getAllClients: (req, res) => {
    //     try {
    //         const clients = clientModel.getAllClients();
    //         res.json(clients);
    //     } catch (e) {
    //         console.error('Ошибка чтения базы данных:', e);
    //         res.status(500).json({ error: 'Ошибка чтения базы данных' });
    //     }
    // },
    //
    // getClientById: (req, res) => {
    //     const id = Number(req.params.id);
    //     const client = clientModel.getClientById(id);
    //
    //     if (client) {
    //         res.json(client);
    //     } else {
    //         res.status(404).json({ error: 'Клиент не найден' });
    //     }
    // },
    //
    // createClient: (req, res) => {
    //     const newClient = {
    //         id: Date.now(),
    //         mainStatus: {active: ''},
    //         archive: false,
    //         createDate: getCurrentFormattedDate(),
    //         ...req.body,
    //         region: '',
    //         city: '',
    //         suppliers: [],
    //         contacts: [],
    //         history: []
    //     };
    //
    //     const createdClient = clientModel.createClient(newClient);
    //     res.status(201).json(createdClient);
    // },
    //
    // addHistoryItem: (req, res) => {
    //     const clientId = Number(req.params.id);
    //     const newHistoryItem = req.body;
    //
    //     const updatedClient = clientModel.updateClient(clientId, client => {
    //         if (!Array.isArray(client.history)) client.history = [];
    //         client.history.push(newHistoryItem);
    //         return client;
    //     });
    //
    //     if (updatedClient) {
    //         res.json(updatedClient);
    //     } else {
    //         res.status(404).json({ message: 'Клиент не найден' });
    //     }
    // },
    //
    // updateClient: (req, res) => {
    //     const id = Number(req.params.id);
    //     const updatedData = req.body;
    //
    //     const updatedClient = clientModel.updateClient(id, client => ({
    //         ...client,
    //         ...updatedData,
    //         archive: updatedData.archive !== undefined ? updatedData.archive : client.archive
    //     }));
    //
    //     if (updatedClient) {
    //         res.json(updatedClient);
    //     } else {
    //         res.status(404).json({ error: 'Клиент не найден' });
    //     }
    // },
    //
    // mainStatusClient: (req, res) => {
    //     const id = Number(req.params.id); // 1750000000001
    //     const newMainStatus = req.body; // { "potential": "Комментарий" }
    //
    //     const updatedClient = clientModel.mainStatusClient(id, newMainStatus); // щас узнаем
    //
    //     if (updatedClient) {
    //         res.json(updatedClient);
    //     } else {
    //         res.status(404).json({ error: 'Клиент не найден' });
    //     }
    // },
    //
    // updateMainContact: (req, res) => {
    //     const clientId = Number(req.params.id);
    //     const { mainIndex } = req.body;
    //
    //     const updatedClient = clientModel.updateClient(clientId, client => {
    //         if (!Array.isArray(client.contacts)) {
    //             return client;
    //         }
    //
    //         return {
    //             ...client,
    //             contacts: client.contacts.map((contact, i) => ({
    //                 ...contact,
    //                 isMain: i === mainIndex
    //             }))
    //         };
    //     });
    //
    //     if (updatedClient) {
    //         res.json(updatedClient);
    //     } else {
    //         res.status(404).json({ message: 'Клиент не найден' });
    //     }
    // },
    //
    // addContact: (req, res) => {
    //     const clientId = Number(req.params.id);
    //     const newContact = { ...req.body, isMain: false };
    //
    //     const updatedClient = clientModel.updateClient(clientId, client => {
    //         if (!Array.isArray(client.contacts)) client.contacts = [];
    //         client.contacts.push(newContact);
    //         return client;
    //     });
    //
    //     if (updatedClient) {
    //         res.json(updatedClient);
    //     } else {
    //         res.status(404).json({ error: 'Клиент не найден' });
    //     }
    // }
};