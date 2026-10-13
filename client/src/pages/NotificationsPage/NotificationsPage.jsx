import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotificationsPage.module.scss';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch('/api/reminders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Не удалось загрузить уведомления');
          return;
        }

        setNotifications(data);
      } catch (err) {
        console.error('Ошибка загрузки уведомлений:', err);
        setError('Ошибка соединения с сервером');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/reminders/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Ошибка отметки уведомления:', data);
        return;
      }

      // Сразу убираем прочитанное уведомление со страницы
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId),
      );
    } catch (error) {
      console.error('Ошибка отметки уведомления:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>
          ← Главная
        </Link>

        <h1>Уведомления</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {!error && notifications.length === 0 && (
        <div className={styles.empty}>У вас нет новых уведомлений</div>
      )}

      <div className={styles.list}>
        {notifications.map((notification) => (
          <div key={notification.id} className={styles.notification}>
            <div className={styles.notificationHeader}>
              <Link
                to={`/client/${notification.client.id}`}
                className={styles.clientLink}
              >
                {notification.client.company}
              </Link>

              <span className={styles.date}>
                {new Date(notification.remindAt).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <p className={styles.description}>{notification.description}</p>

            <button
              type="button"
              className={styles.readButton}
              onClick={() => markAsRead(notification.id)}
            >
              Прочитано
            </button>

            {notification.client.country && (
              <p className={styles.country}>{notification.client.country}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;
