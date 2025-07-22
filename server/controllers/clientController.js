const clientModel = require('../models/clientModel');
const { getCurrentFormattedDate } = require('../utils/dateUtils');

module.exports = {
    getAllClients: (req, res) => {
        try {
            const clients = clientModel.getAllClients();
            res.json(clients);
        } catch (e) {
            console.error('Ошибка чтения базы данных:', e);
            res.status(500).json({ error: 'Ошибка чтения базы данных' });
        }
    },

    getClientById: (req, res) => {
        const id = Number(req.params.id);
        const client = clientModel.getClientById(id);

        if (client) {
            res.json(client);
        } else {
            res.status(404).json({ error: 'Клиент не найден' });
        }
    },

    createClient: (req, res) => {
        const newClient = {
            id: Date.now(),
            mainStatus: {active: ''},
            archive: false,
            createDate: getCurrentFormattedDate(),
            ...req.body,
            region: '',
            city: '',
            suppliers: [],
            contacts: [],
            history: []
        };

        const createdClient = clientModel.createClient(newClient);
        res.status(201).json(createdClient);
    },

    addHistoryItem: (req, res) => {
        const clientId = Number(req.params.id);
        const newHistoryItem = req.body;

        const updatedClient = clientModel.updateClient(clientId, client => {
            if (!Array.isArray(client.history)) client.history = [];
            client.history.push(newHistoryItem);
            return client;
        });

        if (updatedClient) {
            res.json(updatedClient);
        } else {
            res.status(404).json({ message: 'Клиент не найден' });
        }
    },

    updateClient: (req, res) => {
        const id = Number(req.params.id);
        const updatedData = req.body;

        const updatedClient = clientModel.updateClient(id, client => ({
            ...client,
            ...updatedData,
            archive: updatedData.archive !== undefined ? updatedData.archive : client.archive
        }));

        if (updatedClient) {
            res.json(updatedClient);
        } else {
            res.status(404).json({ error: 'Клиент не найден' });
        }
    },

    mainStatusClient: (req, res) => {
        const id = Number(req.params.id); // 1750000000001
        const newMainStatus = req.body; // { "potential": "Комментарий" }

        const updatedClient = clientModel.mainStatusClient(id, newMainStatus); // щас узнаем

        if (updatedClient) {
            res.json(updatedClient);
        } else {
            res.status(404).json({ error: 'Клиент не найден' });
        }
    },

    updateMainContact: (req, res) => {
        const clientId = Number(req.params.id);
        const { mainIndex } = req.body;

        const updatedClient = clientModel.updateClient(clientId, client => {
            if (!Array.isArray(client.contacts)) {
                return client;
            }

            return {
                ...client,
                contacts: client.contacts.map((contact, i) => ({
                    ...contact,
                    isMain: i === mainIndex
                }))
            };
        });

        if (updatedClient) {
            res.json(updatedClient);
        } else {
            res.status(404).json({ message: 'Клиент не найден' });
        }
    },

    addContact: (req, res) => {
        const clientId = Number(req.params.id);
        const newContact = { ...req.body, isMain: false };

        const updatedClient = clientModel.updateClient(clientId, client => {
            if (!Array.isArray(client.contacts)) client.contacts = [];
            client.contacts.push(newContact);
            return client;
        });

        if (updatedClient) {
            res.json(updatedClient);
        } else {
            res.status(404).json({ error: 'Клиент не найден' });
        }
    }
};