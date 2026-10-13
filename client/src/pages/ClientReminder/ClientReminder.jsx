import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ClientReminder.module.scss';

function ClientReminder() {
  const { id } = useParams();

  const [description, setDescription] = useState('');
  const [remindAt, setRemindAt] = useState('');

  const [reminders, setReminders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [remindersLoading, setRemindersLoading] = useState(true);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchReminders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/reminders/client/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Ошибка загрузки напоминаний:', data);
        return;
      }

      setReminders(data);
    } catch (err) {
      console.error('Ошибка загрузки напоминаний:', err);
    } finally {
      setRemindersLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!description.trim()) {
      setError('Введите описание напоминания');
      return;
    }

    if (!remindAt) {
      setError('Выберите дату и время напоминания');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('token');

      const res = await fetch('/api/reminders', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          clientId: Number(id),
          description: description.trim(),
          remindAt: new Date(remindAt).toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Не удалось создать напоминание');
        return;
      }

      setDescription('');
      setRemindAt('');

      setMessage('Напоминание успешно создано');

      // Сразу обновляем список "В ожидании"
      await fetchReminders();
    } catch (err) {
      console.error('Ошибка создания напоминания:', err);

      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.createSection}>
        <h2>Создать напоминание</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="description">Описание</label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например: позвонить клиенту и уточнить решение по заказу"
              rows={5}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="remindAt">Дата и время напоминания</label>

            <input
              id="remindAt"
              type="datetime-local"
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {message && <div className={styles.success}>{message}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать напоминание'}
          </button>
        </form>
      </div>

      <div className={styles.pendingSection}>
        <h2>
          В ожидании
          {reminders.length > 0 && (
            <span className={styles.pendingCount}>{reminders.length}</span>
          )}
        </h2>

        {remindersLoading ? (
          <p className={styles.pendingMessage}>Загрузка...</p>
        ) : reminders.length === 0 ? (
          <p className={styles.pendingMessage}>Нет напоминаний в ожидании</p>
        ) : (
          <div className={styles.reminderList}>
            {reminders.map((reminder) => {
              const reminderDate = new Date(reminder.remindAt);

              const isDue = reminderDate <= new Date();

              return (
                <div key={reminder.id} className={styles.reminderItem}>
                  <div className={styles.reminderItemHeader}>
                    <span className={styles.reminderDate}>
                      {reminderDate.toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {isDue && (
                      <span className={styles.dueBadge}>Ожидает прочтения</span>
                    )}
                  </div>

                  <p className={styles.reminderDescription}>
                    {reminder.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientReminder;
