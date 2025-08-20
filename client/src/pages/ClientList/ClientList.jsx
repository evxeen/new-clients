import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ClientList.module.scss';
import AddClientForm from "../../components/AddClientForm/AddClientForm.jsx";

function ClientList() {
    const [clients, setClients] = useState([]);
    const [formIsOpen, setFormIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [managerFilter, setManagerFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        fetch('/api/clients')
            .then((res) => res.json())
            .then((data) => setClients(data.reverse()))
            .catch((err) => console.error('Ошибка загрузки клиентов:', err));
    }, []);

    const toggleForm = (isOpen) => {
        setFormIsOpen(isOpen);
    };

    const uniqueManagers = [...new Set(clients.map(c => c.manager).filter(Boolean))];
    const uniqueStatuses = [...new Set(
        clients.map(c => c.history?.[c.history.length - 1]?.status).filter(Boolean)
    )];
    const uniqueRegions = [...new Set(clients.map(c => c.region).filter(Boolean))];

    const getCategory = (client) => {
        if (client.mainStatus?.marriage) return "Отбракованные";
        if (client.mainStatus?.potential) return "Потенциальные";
        return "Действующие";
    };

    const filteredClients = clients.filter(client => {
        const lastStatus = client.history?.[client.history.length - 1]?.status;
        const category = getCategory(client);

        return (
            (managerFilter === 'all' || client.manager === managerFilter) &&
            (statusFilter === 'all' || lastStatus === statusFilter) &&
            (regionFilter === 'all' || client.region === regionFilter) &&
            (categoryFilter === 'all' || category === categoryFilter) &&
            client.company.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className={styles.containerContent}>
            {formIsOpen && (
                <AddClientForm
                    closeForm={toggleForm}
                    onClientAdded={(newClient) => setClients(prev => [newClient, ...prev])}
                />
            )}

            <div className={styles.header}>
                <div className={styles.additionally}>
                    <input
                        type="text"
                        placeholder="Поиск по названию компании..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <Link className={styles.funnelButton} to="/funnel">Воронка</Link>
                    <Link className={styles.funnelButton} to="/leads">Лиды</Link>
                </div>

                <button className={styles.addButton} onClick={() => toggleForm(true)}>Добавить</button>
            </div>

            <div className={styles.filters}>
                <select value={managerFilter} onChange={(e) => setManagerFilter(e.target.value)}>
                    <option value="all">Все менеджеры</option>
                    {uniqueManagers.map(manager => (
                        <option key={manager} value={manager}>{manager}</option>
                    ))}
                </select>

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Все статусы</option>
                    {uniqueStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>

                <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
                    <option value="all">Все регионы</option>
                    {uniqueRegions.map(region => (
                        <option key={region} value={region}>{region}</option>
                    ))}
                </select>

                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="all">Все категории</option>
                    <option value="Действующие">Действующие</option>
                    <option value="Потенциальные">Потенциальные</option>
                    <option value="Отбракованные">Отбракованные</option>
                </select>
            </div>

            <div className={styles.listContainer}>
                {filteredClients.map(client => (
                    <Link
                        key={client.id}
                        to={`/client/${client.id}`}
                        className={`${styles.clientBlock} ${
                            client.mainStatus?.marriage ? styles.marriage :
                                client.mainStatus?.potential ? styles.potential :
                                    styles.active
                        }`}
                    >
                        <div className={styles.clientHeader}>
                            <h3>{client.company}</h3>
                        </div>
                        <p>Менеджер: {client.manager}</p>
                        <p>Регион: {client.country}</p>
                        <p>Категория: {getCategory(client)}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ClientList;


