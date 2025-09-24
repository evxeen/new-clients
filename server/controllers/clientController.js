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

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Некорректный ID клиента' });
        }

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
                    suppliers: [
                        {
                            "name": "Китай",
                            "select": false
                        },
                        {
                            "name": "РФ производитель",
                            "select": false
                        },
                        {
                            "name": "РФ поставщик",
                            "select": false
                        },
                        {
                            "name": "Наши дилеры",
                            "select": false
                        }
                    ],
                    contacts: [],
                    history: [],
                    staff: '',
                    branchAvailability: [],
                    warehouses: [],
                    customers: '',
                    salesVolume: '',
                    sourceLid:'',
                    manager: 'Менеджер',
                    managerId: req.user.role === "MANAGER" ? req.user.id : null,
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
        try {
            const { id } = req.params;
            const newHistoryEntry = req.body;
            const clientId = Number(id);

            // Генерируем уникальный ID для записи
            const entryId = Date.now();
            const entryWithId = {
                ...newHistoryEntry,
                id: entryId
            };

            // Находим клиента
            const client = await prisma.client.findUnique({
                where: { id: clientId },
            });

            if (!client) {
                return res.status(404).json({ error: 'Клиент не найден' });
            }

            // Обновляем историю
            const updatedHistory = client.history
                ? { ...client.history, [entryId]: entryWithId }
                : { [entryId]: entryWithId };

            // Обновляем клиента в базе
            await prisma.client.update({
                where: { id: clientId },
                data: { history: updatedHistory },
            });

            // Возвращаем новую запись с ID
            res.status(201).json(entryWithId);

        } catch (err) {
            console.error('Ошибка при добавлении истории:', err);
            res.status(500).json({ error: 'Не удалось добавить историю' });
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

    getLeadsTable: async (req, res) => {
        try {
            const clients = await prisma.client.findMany();

            const leads = clients.map((client, index) => {
                // --- Квалификация ---
                let qualification = "МК";
                if (client.requirement.length > 5) qualification = "БК";
                else if (client.requirement.length > 3) qualification = "СК";

                // --- Результат ---
                let result = "НК"; // не квалифицирован
                if (client.mainStatus?.potential) result = "ПК";
                if (client.mainStatus?.marriage) result = "БР";

                let description;

                if (client.mainStatus.active === undefined) {
                    // Если нет свойства active, ищем другие возможные свойства
                    if (client.mainStatus.potential !== undefined) {
                        description = client.mainStatus.potential;
                    } else if (client.mainStatus.marriage !== undefined) {
                        description = client.mainStatus.marriage;
                    }
                }

                return {
                    number: index + 1,
                    company: client.company || "Без названия",
                    qualification,
                    result,
                    description,
                    reasonAdd: client.reasonAdd || "",
                    reasonReject: client.reasonReject || ""
                };
            });

            res.json(leads);
        } catch (error) {
            console.error('Ошибка при формировании таблицы лидов:', error);
            res.status(500).json({ error: 'Ошибка сервера при получении лидов' });
        }
    },

    getCountries: async (req, res) => {
        try {
            const countries = await prisma.country.findMany({
                orderBy: { name: 'asc' }
            });

            const safeCountries = countries.map(c => ({
                ...c,
                id: c.id.toString() // или Number(c.id)
            }));

            res.json(safeCountries);
        } catch (error) {
            console.error('Ошибка при получении стран:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },

    getRegions: async (req, res) => {
        try {
            const { countryId } = req.query;
            if (!countryId) return res.status(400).json({ error: 'Не передан countryId' });

            const regions = await prisma.region.findMany({
                where: { countryId: BigInt(countryId) },
                orderBy: { name: 'asc' }
            });

            const safeRegions = regions.map(r => ({
                ...r,
                id: r.id.toString(),
                countryId: r.countryId.toString()
            }));

            res.json(safeRegions);
        } catch (error) {
            console.error('Ошибка при получении регионов:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },

    getCities: async (req, res) => {
        try {
            const { regionId, countryId } = req.query;

            let cities;
            if (regionId) {
                cities = await prisma.city.findMany({
                    where: { regionId: BigInt(regionId) },
                    orderBy: { name: 'asc' }
                });
            } else if (countryId) {
                cities = await prisma.city.findMany({
                    where: { region: { countryId: BigInt(countryId) } },
                    orderBy: { name: 'asc' }
                });
            } else {
                return res.status(400).json({ error: 'Не передан regionId или countryId' });
            }

            const safeCities = cities.map(c => ({
                ...c,
                id: c.id.toString(),
                regionId: c.regionId.toString()
            }));

            res.json(safeCities);
        } catch (error) {
            console.error('Ошибка при получении городов:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },
};