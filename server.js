const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const {json} = require("express");
const e = require("express");
const app = express();
const PORT = 3001;

const db = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// 📌 Получить всех клиентов
app.get('/api/clients', (req, res) => {
  try {
    if (fs.existsSync(db)) {
      const allClients = fs.readFileSync(db, 'utf-8');
      res.json(JSON.parse(allClients)); // ✅ отправляем ответ клиенту
    } else {
      res.json([]); // ✅ если файл не найден — отправляем пустой массив
    }
  } catch (e) {
    console.error('Ошибка чтения db.json:', e);
    res.status(500).json({ error: 'Ошибка чтения базы данных' }); // ✅ ошибка сервера
  }
});



// // 📌 Получить одного клиента по ID
// app.get('/api/clients/:id', (req, res) => {
//   const client = clients.find((c) => c.id === parseInt(req.params.id));
//   if (client) res.json(client);
//   else res.status(404).json({ error: 'Client not found' });
// });

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
  } = req.body;

  const newClient = {
    id: Date.now(),
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
    status: 'Установление контакта',
    contacts: [
      {post: null, phone: null, email: null}
    ],
    history: []
  };

// Читаем текущих клиентов
  let clients = [];
  if (fs.existsSync(db)) {
    const rawData = fs.readFileSync(db, 'utf-8');
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
  fs.writeFile(db, JSON.stringify(clients, null, 2), (err) => {
    if (err) console.error('Ошибка записи db:', err);
  });

  res.status(201).json(newClient);
});

// 📌 Обновить данные клиента
// app.put('/api/clients/:id', (req, res) => {
//   const clientId = Number(req.params.id);
//   const updatedData = req.body;
//
//   const clientIndex = clients.findIndex((c) => c.id === clientId);
//   if (clientIndex === -1) return res.status(404).json({ message: 'Клиент не найден' });
//
//   // сохраняем историю, заменяем остальное
//   const oldHistory = clients[clientIndex].history || [];
//   clients[clientIndex] = { ...updatedData, id: clientId, history: oldHistory };
//
//   res.json(clients[clientIndex]);
// });
//
// // 📌 удаление клиента
// app.delete('/api/clients/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = clients.findIndex(client => client.id === id);
//   if (index !== -1) {
//     clients.splice(index, 1);
//     res.sendStatus(200);
//   } else {
//     res.status(404).json({ error: 'Клиент не найден' });
//   }
// });
//
//
// // 📌 Добавить запись в историю клиента
// app.post('/api/clients/:id/history', (req, res) => {
//   const clientId = Number(req.params.id);
//   const { note } = req.body;
//   const client = clients.find((c) => c.id === clientId);
//
//   if (!client) {
//     return res.status(404).json({ message: 'Клиент не найден' });
//   }
//
//   if (!client.history) {
//     client.history = [];
//   }
//
//   const date = new Date().toISOString().replace('T', ' ').substring(0, 16); // "2025-06-27 21:45"
//   client.history.push({ date, note });
//
//   res.status(201).json({ message: 'Запись добавлена', history: client.history });
// });
//

// 📦 Отдача статики
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// 🎯 SPA: для всех путей отдаём index.html
app.get(/\/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});