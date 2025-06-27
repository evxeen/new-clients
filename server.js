const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let clients = [
    {
        id: 1,
        company: 'ООО "СтройИнвест"',
        manager: 'Иванов И.И.',
        status: 'ожидает звонка',
        email: 'contact@stroinvest.by',
        phone: '+375291112233',
        representative: 'Сергей Павлов',
        history: [
            { date: '2025-06-25 10:30', note: 'Созвонились, клиент попросил коммерческое предложение' }
        ]
    },
    {
        id: 2,
        company: 'ЗАО "МеталПром"',
        manager: 'Петров П.П.',
        status: 'в работе',
        email: 'info@metalprom.ru',
        phone: '+375291234567',
        representative: 'Ольга Смирнова',
        history: [
            { date: '2025-06-26 12:00', note: 'Обсудили условия поставки' }
        ]
    }
];

// 📌 Получить всех клиентов
app.get('/api/clients', (req, res) => {
    res.json(clients);
});

// 📌 Получить одного клиента по ID
app.get('/api/clients/:id', (req, res) => {
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (client) res.json(client);
    else res.status(404).json({ error: 'Client not found' });
});

// 📌 Создать нового клиента
app.post('/api/clients', (req, res) => {
    const { company, manager, status, email, phone, representative } = req.body;

    const newClient = {
        id: Date.now(),
        company,
        manager,
        status,
        email,
        phone,
        representative,
        history: []
    };

    clients.push(newClient);
    res.status(201).json(newClient);
});

// 📌 Обновить данные клиента
app.put('/api/clients/:id', (req, res) => {
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (!client) return res.status(404).json({ error: 'Client not found' });

    Object.assign(client, req.body);
    res.json(client);
});

// 📌 Добавить запись в историю клиента
app.post('/api/clients/:id/history', (req, res) => {
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (!client) return res.status(404).json({ error: 'Client not found' });

    const { message } = req.body;
    const historyItem = { date: new Date().toISOString(), message };
    client.history.push(historyItem);
    res.status(201).json(historyItem);
});

// 📌 Простейшая статистика по менеджерам
app.get('/api/stats', (req, res) => {
    const stats = {};
    clients.forEach(client => {
        const manager = client.manager || 'неизвестно';
        if (!stats[manager]) {
            stats[manager] = { total: 0, inWork: 0 };
        }
        stats[manager].total += 1;
        if (client.status !== 'новый') {
            stats[manager].inWork += 1;
        }
    });
    res.json(stats);
});

// 📦 Отдача статики
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// 🎯 SPA: для всех путей отдаём index.html
app.get(/\/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
