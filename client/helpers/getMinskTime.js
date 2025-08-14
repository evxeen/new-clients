export const getMinskTime = () => {
    const now = new Date();

    // Форматирование с учетом часового пояса
    const formatter = new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Minsk',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    // Получаем отформатированные части
    const parts = formatter.formatToParts(now);

    // Извлекаем компоненты
    const day = parts.find(p => p.type === 'day').value;
    const month = parts.find(p => p.type === 'month').value;
    const year = parts.find(p => p.type === 'year').value;
    const hour = parts.find(p => p.type === 'hour').value;
    const minute = parts.find(p => p.type === 'minute').value;

    return `${day}.${month}.${year} ${hour}:${minute}`;
};

