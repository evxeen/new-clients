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
    const [archiveFilter, setArchiveFilter] = useState('all');

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
        clients
            .map(c => c.history?.[c.history.length - 1]?.status)
            .filter(Boolean)
    )];
    const uniqueRegions = [...new Set(clients.map(c => c.region).filter(Boolean))];

    const filteredClients = clients.filter(client => {
        const lastStatus = client.history?.[client.history.length - 1]?.status;

        return (
            (managerFilter === 'all' || client.manager === managerFilter) &&
            (statusFilter === 'all' || lastStatus === statusFilter) &&
            (regionFilter === 'all' || client.region === regionFilter) &&
            (archiveFilter === 'all' ||
                (archiveFilter === 'archived' && client.archive) ||
                (archiveFilter === 'active' && !client.archive)) &&
            client.company.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className={styles.containerContent}>
            {formIsOpen && <AddClientForm closeForm={toggleForm} />}

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

                    <select value={archiveFilter} onChange={(e) => setArchiveFilter(e.target.value)}>
                        <option value="all">Все клиенты</option>
                        <option value="active">Действующие</option>
                        <option value="archived">Архивные</option>
                    </select>
                </div>
                <div className={styles.listContainer}>

                    {filteredClients.map(client => (
                        <Link
                            key={client.id}
                            to={`/client/${client.id}`}
                            className={`${styles.clientBlock} ${client.archive ? styles.archived : ''}`}
                        >
                            <div className={styles.clientHeader}>
                                <h3>{client.company}</h3>
                            </div>
                            <p>Менеджер: {client.manager}</p>
                            <p>Статус: {client.history[client.history.length - 1].status}</p>
                            <p>Регион: {client.region}</p>
                        </Link>
                    ))}
                </div>
            </div>
            );
            }

            export default ClientList;
