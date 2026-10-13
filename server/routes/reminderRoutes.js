const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { clientId, description, remindAt } = req.body;

    // Проверяем описание
    if (!description || !description.trim()) {
      return res.status(400).json({
        error: 'Введите описание напоминания',
      });
    }

    // Проверяем клиента
    const parsedClientId = Number(clientId);

    if (!Number.isInteger(parsedClientId)) {
      return res.status(400).json({
        error: 'Некорректный ID клиента',
      });
    }

    // Проверяем дату
    if (!remindAt) {
      return res.status(400).json({
        error: 'Выберите дату напоминания',
      });
    }

    const reminderDate = new Date(remindAt);

    if (Number.isNaN(reminderDate.getTime())) {
      return res.status(400).json({
        error: 'Некорректная дата напоминания',
      });
    }

    // Проверяем, существует ли клиент
    const client = await prisma.client.findUnique({
      where: {
        id: parsedClientId,
      },
      select: {
        id: true,
      },
    });

    if (!client) {
      return res.status(404).json({
        error: 'Клиент не найден',
      });
    }

    // Создаем напоминание
    // userId ВСЕГДА берем из JWT, а не из req.body
    const reminder = await prisma.reminder.create({
      data: {
        description: description.trim(),
        remindAt: reminderDate,
        clientId: parsedClientId,
        userId: req.user.id,
      },
    });

    return res.status(201).json(reminder);
  } catch (error) {
    console.error('Ошибка создания напоминания:', error);

    return res.status(500).json({
      error: 'Не удалось создать напоминание',
    });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: req.user.id,
        isRead: false,
        remindAt: {
          lte: new Date(),
        },
      },

      include: {
        client: {
          select: {
            id: true,
            company: true,
            country: true,
          },
        },
      },

      orderBy: {
        remindAt: 'desc',
      },
    });

    return res.json(reminders);
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error);

    return res.status(500).json({
      error: 'Не удалось получить уведомления',
    });
  }
});

// Отметить уведомление как прочитанное
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const reminderId = Number(req.params.id);

    if (!Number.isInteger(reminderId)) {
      return res.status(400).json({
        error: 'Некорректный ID уведомления',
      });
    }

    const result = await prisma.reminder.updateMany({
      where: {
        id: reminderId,
        userId: req.user.id,
      },
      data: {
        isRead: true,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        error: 'Уведомление не найдено',
      });
    }

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error('Ошибка обновления уведомления:', error);

    return res.status(500).json({
      error: 'Не удалось отметить уведомление как прочитанное',
    });
  }
});

// Все непрочитанные напоминания текущего пользователя
// по конкретному клиенту
router.get('/client/:clientId', authMiddleware, async (req, res) => {
  try {
    const clientId = Number(req.params.clientId);

    if (!Number.isInteger(clientId)) {
      return res.status(400).json({
        error: 'Некорректный ID клиента',
      });
    }

    const reminders = await prisma.reminder.findMany({
      where: {
        clientId,
        userId: req.user.id,
        isRead: false,
      },

      orderBy: {
        remindAt: 'asc',
      },
    });

    return res.json(reminders);
  } catch (error) {
    console.error('Ошибка получения напоминаний клиента:', error);

    return res.status(500).json({
      error: 'Не удалось получить напоминания',
    });
  }
});

module.exports = router;
