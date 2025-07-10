const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const e = require("express");
const app = express();
const PORT = 3001;

const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// 📌 Получить всех клиентов
app.get('/api/clients', (req, res) => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const allClients = fs.readFileSync(DB_PATH, 'utf-8');
      res.json(JSON.parse(allClients)); // ✅ отправляем ответ клиенту
    } else {
      res.json([]); // ✅ если файл не найден — отправляем пустой массив
    }
  } catch (e) {
    console.error('Ошибка чтения db.json:', e);
    res.status(500).json({ error: 'Ошибка чтения базы данных' }); // ✅ ошибка сервера
  }
});

// 📌 Получить одного клиента по ID
app.get('/api/clients/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!fs.existsSync(DB_PATH)) {
    return res.status(404).json({ error: 'База данных не найдена' });
  }

  const rawData = fs.readFileSync(DB_PATH, 'utf-8');
  let clients = [];

  try {
    clients = JSON.parse(rawData);
  } catch (e) {
    console.error('Ошибка парсинга JSON:', e);
    return res.status(500).json({ error: 'Ошибка чтения базы данных' });
  }

  const client = clients.find(c => c.id === id);

  if (client) {
    res.json(client);
  } else {
    res.status(404).json({ error: 'Клиент не найден' });
  }
});

// 📌 Создать нового клиента
app.post('/api/clients', (req, res) => {
  const {company,
    activity,
    requirement,
    volume,
    code,
    address,
    site,
    email,
    phone,
    director,
    authority,
    manager,

  } = req.body;

  const now = new Date();
  now.setHours(now.getHours() + 3);

  const createDate = now.toISOString().replace('T', ' ').substring(0, 16); // "2025-07-02 14:25"

  const newClient = {
    id: Date.now(),
    createDate,
    company,
    activity,
    requirement,
    volume,
    code,
    address,
    site,
    email,
    phone,
    director,
    authority,
    manager,
    region: 'Московская область',
    city: 'Подольск',
    suppliers: [],
    status: 'Установление контакта',
    contacts: [
      {name: '', lastName: '', post: null, phone: null, email: null}
    ],
    history: []
  };

// Читаем текущих клиентов
  let clients = [];
  if (fs.existsSync(DB_PATH)) {
    const rawData = fs.readFileSync(DB_PATH, 'utf-8');
    try {
      clients = JSON.parse(rawData);
    } catch (e) {
      console.error('Ошибка парсинга JSON:', e);
      clients = [];
    }
  }

// Добавляем нового клиента
  clients.push(newClient);

// Записываем обратно
  fs.writeFile(DB_PATH, JSON.stringify(clients, null, 2), (err) => {
    if (err) console.error('Ошибка записи db:', err);
  });

  res.status(201).json(newClient);
});

app.post('/api/clients/:id/history', (req, res) => {
  const clientId = Number(req.params.id);
  const newHistoryItem = req.body;

  fs.readFile(DB_PATH, 'utf-8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения файла:', err);
      return res.status(500).json({ message: 'Ошибка чтения базы данных' });
    }

    let clients;
    try {
      clients = JSON.parse(data); // теперь это просто массив
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError);
      return res.status(500).json({ message: 'Ошибка чтения базы данных' });
    }

    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex === -1) {
      return res.status(404).json({ message: 'Клиент не найден' });
    }

    const client = clients[clientIndex];

    if (!Array.isArray(client.history)) {
      client.history = [];
    }

    client.history.push(newHistoryItem);

    fs.writeFile(DB_PATH, JSON.stringify(clients, null, 2), 'utf-8', (writeErr) => {
      if (writeErr) {
        console.error('Ошибка записи в файл:', writeErr);
        return res.status(500).json({ message: 'Ошибка сохранения данных' });
      }

      res.json(client);
    });
  });
});

// 📌 Обновить клиента по ID
app.put('/api/clients/:id', (req, res) => {
  const id = Number(req.params.id);
  const updatedData = req.body;

  if (!fs.existsSync(DB_PATH)) {
    return res.status(404).json({ error: 'База данных не найдена' });
  }

  fs.readFile(DB_PATH, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Ошибка чтения базы данных' });

    let clients;
    try {
      clients = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Ошибка парсинга данных' });
    }

    const index = clients.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Клиент не найден' });

    clients[index] = { ...clients[index], ...updatedData };

    fs.writeFile(DB_PATH, JSON.stringify(clients, null, 2), 'utf-8', (writeErr) => {
      if (writeErr) return res.status(500).json({ error: 'Ошибка записи' });

      res.json(clients[index]);
    });
  });
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