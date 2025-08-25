const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Конфигурация
const config = require('./config');
const PORT = config.PORT;

// Маршруты
const clientRoutes = require('./routes/clientRoutes');

// Мидлвары
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/clients', clientRoutes);

// Статическая отдача клиента
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA Fallback
app.get(/\/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// app.listen(PORT, '127.0.0.1', () => {
//     console.log(`Сервер запущен на http://localhost:${PORT}`);
// });
