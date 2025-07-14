import React, { useEffect, useState } from 'react';
import styles from './FunnelPage.module.scss';

const statusOptions = {
    "1. Первое обращение к клиенту": [
        "Дозвон. Установлен контакт",
        "Недозвон",
        "Отправлено холодное письмо",
        "Получен ответ на холодное письмо",
        "Согласовано время разговора"
    ],
    "2. Квалификация клиента": [
        "Потребность есть. Закупает у конкурента",
        "Есть интерес к нашим метизам",
        "Отсутствует интерес к нашим метизам",
        "Договорились о получении запроса"
    ],
    "3. Согласование ассортимента и объема заявки": [
        "Ждем запрос от клиента",
        "Получен запрос от клиента",
        "Подготовка ответа на запрос",
        "Ответ на запрос отправлен",
        "Ассортимент и объем заявки согласован"
    ],
    "4. Предоставление Коммерческого предложения": [
        "КП отправлено",
        "Ожидаем ответа",
        "Требуются правки"
    ],
    "5. Корректировка Коммерческого предложения": [
        "Получен ответ на КП",
        "КП устраивает",
        "КП не устраивает",
        "Подготовка корректировки КП",
        "Скорректированное КП отправлено"
    ],
    "6. Передача клиента для заключения договора": [
        "Клиент против заключения договора",
        "Клиент готов заключить договор",
        "Клиент передан менеджеру для заключения договора"
    ],
    "7. Заключение договора": [
        "Клиенту направлен проект договора",
        "Договор в стадии подписания",
        "Договор подписан"
    ],
    "8. Размещение заказа": [
        "Ожидание заказа у клиента",
        "Заказ получен и передан ПрО",
        "Заказ готов"
    ],
    "9. Оплата и отгрузка заказа": [
        "Ожидание оплаты",
        "Заказ оплачен",
        "Ожидание отгрузки",
        "Отгрузка заказа произведена"
    ]
};

function getPipelineStatuses(history) {
    const statuses = {};
    const keys = Object.keys(statusOptions);

    for (let i = 0; i < keys.length; i++) {
        const step = keys[i];
        const results = history.filter(h => h.status === step).map(h => h.result);

        if (results.length === 0) {
            statuses[step] = null;
        } else if (results.includes(statusOptions[step].at(-1))) {
            statuses[step] = "выполнено";
        } else {
            statuses[step] = "в процессе";
        }
    }

    // Устанавливаем "начато" только если предыдущий этап завершён ("выполнено")
    for (let i = 0; i < keys.length; i++) {
        const step = keys[i];
        if (statuses[step] === null) {
            if (i === 0 || statuses[keys[i - 1]] === "выполнено") {
                statuses[step] = "начато";
            }
            break;
        }
    }

    return statuses;
}

function FunnelPage() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(err => console.error('Ошибка загрузки клиентов:', err));
    }, []);

    const steps = Object.keys(statusOptions);

    return (
        <div className={styles.funnelContainer}>

            <table className={styles.funnelTable}>
                <thead>
                <tr>
                    <th>№ п/п</th>
                    <th>Название компании</th>
                    {steps.map((step, i) => <th key={i}>{step}</th>)}
                </tr>
                </thead>
                <tbody>
                {clients.map((client, index) => {
                    const pipeline = getPipelineStatuses(client.history || []);
                    return (
                        <tr key={client.id}>
                            <td>{index + 1}</td>
                            <td>{client.company}</td>
                            {steps.map((step, i) => (
                                <td key={i} className={styles[(pipeline[step] || 'empty').replace(/\s/g, '_')]}>
                                    {pipeline[step] || '—'}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default FunnelPage;
