import React, { useEffect, useState } from 'react';
import styles from './FunnelPage.module.scss';
import {Link} from "react-router-dom";

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
    const [filters, setFilters] = useState({});
    const [archiveFilter, setArchiveFilter] = useState("all");

    useEffect(() => {
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(err => console.error('Ошибка загрузки клиентов:', err));
    }, []);

    const steps = Object.keys(statusOptions);

    const handleFilterChange = (step, value) => {
        setFilters(prev => ({ ...prev, [step]: value }));
    };

    const filteredClients = clients.filter(client => {
        if (archiveFilter === "archived" && !client.archive) return false;
        if (archiveFilter === "active" && client.archive) return false;

        const pipeline = getPipelineStatuses(client.history || []);

        for (const step of steps) {
            const filterVal = filters[step];
            if (filterVal && filterVal !== "all") {
                if (pipeline[step] !== filterVal) return false;
            }
        }

        return true;
    });

    return (
        <div className={styles.funnelContainer}>
            <Link className={styles.backLink} to="/">Назад</Link>
            <div className={styles.filters}>
                <div>
                    <label>Архив:</label>
                    <select value={archiveFilter} onChange={e => setArchiveFilter(e.target.value)}>
                        <option value="all">Все</option>
                        <option value="active">Активные</option>
                        <option value="archived">В архиве</option>
                    </select>
                </div>
                {steps.map(step => (
                    <div key={step}>
                        <label>{step}</label>
                        <select value={filters[step] || "all"} onChange={e => handleFilterChange(step, e.target.value)}>
                            <option value="all">Все</option>
                            <option value="начато">Начато</option>
                            <option value="в процессе">В процессе</option>
                            <option value="выполнено">Выполнено</option>
                        </select>
                    </div>
                ))}
            </div>

            <table className={styles.funnelTable}>
                <thead>
                <tr>
                    <th>№ п/п</th>
                    <th>Название компании</th>
                    {steps.map((step, i) => <th key={i}>{step}</th>)}
                </tr>
                </thead>
                <tbody>
                {filteredClients.map((client, index) => {
                    const pipeline = getPipelineStatuses(client.history || []);
                    return (
                        <tr key={client.id} className={client.archive ? styles.archivedRow : ''}>
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
