// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useLocation } from 'react-router-dom';
// import queryString from 'query-string';
// import styles from './ClientList.module.scss';
// import AddClientForm from "../../components/AddClientForm/AddClientForm.jsx";
// import {getLastHistoryDate} from "../../../helpers/sortOnDataClients.js";
//
// function ClientList() {
//     const [clients, setClients] = useState([]);
//     const [formIsOpen, setFormIsOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [managerFilter, setManagerFilter] = useState('all');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [regionFilter, setRegionFilter] = useState('all');
//     const [categoryFilter, setCategoryFilter] = useState('all');
//
//     const location = useLocation();
//     const queryParams = queryString.parse(location.search);
//
//     useEffect(() => {
//         const fetchClients = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//
//                 const res = await fetch("/api/clients", {
//                     headers: {
//                         "Authorization": `Bearer ${token}`
//                     }
//                 });
//
//                 const data = await res.json();
//
//                 if (!res.ok) {
//                     console.error("Ошибка сервера:", data);
//                     return;
//                 }
//
//                 // if (!Array.isArray(data)) {
//                 //     console.error("Ожидался массив клиентов, а пришло:", data);
//                 //     return;
//                 // }
//
//                 // сортируем по последней дате истории
//                 const sorted = [...data].sort((a, b) => {
//                     const dateA = getLastHistoryDate(a);
//                     const dateB = getLastHistoryDate(b);
//                     if (!dateA && !dateB) return 0;
//                     if (!dateA) return 1;
//                     if (!dateB) return -1;
//                     return dateB - dateA; // новее → выше
//                 });
//
//                 setClients(sorted);
//             } catch (err) {
//                 console.error("Ошибка загрузки клиентов:", err);
//             }
//         };
//
//         fetchClients();
//     }, []);
//
//     // useEffect(() => {
//     //     fetch('/api/clients')
//     //         .then((res) => res.json())
//     //         .then((data) => setClients(data.reverse()))
//     //         .catch((err) => console.error('Ошибка загрузки клиентов:', err));
//     // }, []);
//
//     // Если есть параметр region, сразу устанавливаем фильтр
//     useEffect(() => {
//         if (queryParams.region) {
//             setRegionFilter(queryParams.region);
//         }
//     }, [queryParams]);
//
//     const toggleForm = (isOpen) => {
//         setFormIsOpen(isOpen);
//     };
//
//     const uniqueManagers = [...new Set(clients.map(c => c.manager).filter(Boolean))];
//     const uniqueStatuses = [...new Set(
//         clients.map(c => c.history?.[c.history.length - 1]?.status).filter(Boolean)
//     )];
//     const uniqueRegions = [...new Set(clients.map(c => c.country).filter(Boolean))];
//
//     const getCategory = (client) => {
//         if (client.mainStatus?.marriage) return "Отбракованные";
//         if (client.mainStatus?.potential) return "Потенциальные";
//         return "Действующие";
//     };
//
//     const filteredClients = clients.filter(client => {
//         const lastStatus = client.history?.[client.history.length - 1]?.status;
//         const category = getCategory(client);
//
//         return (
//             (managerFilter === 'all' || client.manager === managerFilter) &&
//             (statusFilter === 'all' || lastStatus === statusFilter) &&
//             (regionFilter === 'all' || client.country === regionFilter) &&
//             (categoryFilter === 'all' || category === categoryFilter) &&
//             client.company.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//     });
//
//     return (
//         <div className={styles.containerContent}>
//             {formIsOpen && (
//                 <AddClientForm
//                     closeForm={toggleForm}
//                     onClientAdded={(newClient) => setClients(prev => [newClient, ...prev])}
//                 />
//             )}
//
//             <div className={styles.header}>
//                 <div className={styles.additionally}>
//                     <input
//                         type="text"
//                         placeholder="Поиск по названию компании..."
//                         className={styles.searchInput}
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//
//                     <Link className={styles.funnelButton} to="/funnel">Воронка</Link>
//                     <Link className={styles.funnelButton} to="/leads">Лиды</Link>
//                 </div>
//
//                 <button className={styles.addButton} onClick={() => toggleForm(true)}>Добавить</button>
//             </div>
//
//             <div className={styles.filters}>
//                 <select value={managerFilter} onChange={(e) => setManagerFilter(e.target.value)}>
//                     <option value="all">Все менеджеры</option>
//                     {uniqueManagers.map(manager => (
//                         <option key={manager} value={manager}>{manager}</option>
//                     ))}
//                 </select>
//
//                 <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//                     <option value="all">Все статусы</option>
//                     {uniqueStatuses.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                     ))}
//                 </select>
//
//                 <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
//                     <option value="all">Все страны</option>
//                     {uniqueRegions.map(region => (
//                         <option key={region} value={region}>{region}</option>
//                     ))}
//                 </select>
//
//                 <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
//                     <option value="all">Все категории</option>
//                     <option value="Действующие">Действующие</option>
//                     <option value="Потенциальные">Потенциальные</option>
//                     <option value="Отбракованные">Отбракованные</option>
//                 </select>
//             </div>
//
//             <div className={styles.listContainer}>
//                 {filteredClients.map(client => (
//                     <Link
//                         key={client.id}
//                         to={`/client/${client.id}`}
//                         className={`${styles.clientBlock} ${
//                             client.mainStatus?.marriage ? styles.marriage :
//                                 client.mainStatus?.potential ? styles.potential :
//                                     styles.active
//                         }`}
//                     >
//                         <div className={styles.clientHeader}>
//                             <h3>{client.company}</h3>
//                         </div>
//                         <p>Менеджер: {client.manager}</p>
//                         <p>Регион: {client.country}</p>
//                         <p>Категория: {getCategory(client)}</p>
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     );
// }
//
// export default ClientList;
//
//
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import styles from './ClientList.module.scss';
import AddClientForm from "../../components/AddClientForm/AddClientForm.jsx";
import {getLastHistoryDate} from "../../../helpers/sortOnDataClients.js";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";

function ClientList() {
    const [clients, setClients] = useState([]);
    const [formIsOpen, setFormIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [managerFilter, setManagerFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [showDateFilter, setShowDateFilter] = useState(false);

    const location = useLocation();
    const queryParams = queryString.parse(location.search);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("/api/clients", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("Ошибка сервера:", data);
                    return;
                }

                // сортируем по последней дате истории
                const sorted = [...data].sort((a, b) => {
                    const dateA = getLastHistoryDate(a);
                    const dateB = getLastHistoryDate(b);
                    if (!dateA && !dateB) return 0;
                    if (!dateA) return 1;
                    if (!dateB) return -1;
                    return dateB - dateA; // новее → выше
                });

                setClients(sorted);
            } catch (err) {
                console.error("Ошибка загрузки клиентов:", err);
            }
        };

        fetchClients();
    }, []);

    // Если есть параметр region, сразу устанавливаем фильтр
    useEffect(() => {
        if (queryParams.region) {
            setRegionFilter(queryParams.region);
        }
    }, [queryParams]);

    const toggleForm = (isOpen) => {
        setFormIsOpen(isOpen);
    };

    const uniqueManagers = [...new Set(clients.map(c => c.manager).filter(Boolean))];
    const uniqueStatuses = [...new Set(
        clients.map(c => c.history?.[c.history.length - 1]?.status).filter(Boolean)
    )];
    const uniqueRegions = [...new Set(clients.map(c => c.country).filter(Boolean))];

    const getCategory = (client) => {
        if (client.mainStatus?.marriage) return "Отбракованные";
        if (client.mainStatus?.potential) return "Потенциальные";
        return "Действующие";
    };

    const handleDateChange = (field, value) => {
        setDateFilter(prev => ({ ...prev, [field]: value }));
    };

    const resetDateFilter = () => {
        setDateFilter({ from: '', to: '' });
    };

    const isDateFilterActive = () => {
        return dateFilter.from !== '' || dateFilter.to !== '';
    };

    const filteredClients = clients.filter(client => {
        const lastStatus = client.history?.[client.history.length - 1]?.status;
        const category = getCategory(client);

        // Фильтр по дате создания
        if (isDateFilterActive()) {
            const clientDate = new Date(client.createDate);

            if (dateFilter.from) {
                const fromDate = new Date(dateFilter.from);
                fromDate.setHours(0, 0, 0, 0);
                if (clientDate < fromDate) return false;
            }

            if (dateFilter.to) {
                const toDate = new Date(dateFilter.to);
                toDate.setHours(23, 59, 59, 999);
                if (clientDate > toDate) return false;
            }
        }

        return (
            (managerFilter === 'all' || client.manager === managerFilter) &&
            (statusFilter === 'all' || lastStatus === statusFilter) &&
            (regionFilter === 'all' || client.country === regionFilter) &&
            (categoryFilter === 'all' || category === categoryFilter) &&
            client.company.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const resetAllFilters = () => {
        setManagerFilter('all');
        setStatusFilter('all');
        setRegionFilter('all');
        setCategoryFilter('all');
        setDateFilter({ from: '', to: '' });
        setSearchQuery('');
        setShowDateFilter(false);
    };

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
                    <option value="all">Все страны</option>
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

                <div className={styles.dateFilterContainer}>
                    <button
                        className={`${styles.dateFilterButton} ${isDateFilterActive() ? styles.activeFilter : ''}`}
                        onClick={() => setShowDateFilter(!showDateFilter)}
                    >
                        <FaCalendarAlt /> Дата создания
                    </button>

                    {showDateFilter && (
                        <div className={styles.dateFilterPopup}>
                            <div className={styles.dateInputs}>
                                <div className={styles.dateInputGroup}>
                                    <label>От:</label>
                                    <input
                                        type="date"
                                        value={dateFilter.from}
                                        onChange={e => handleDateChange('from', e.target.value)}
                                    />
                                </div>
                                <div className={styles.dateInputGroup}>
                                    <label>До:</label>
                                    <input
                                        type="date"
                                        value={dateFilter.to}
                                        onChange={e => handleDateChange('to', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.dateFilterActions}>
                                <button
                                    onClick={resetDateFilter}
                                    className={styles.resetDateButton}
                                    disabled={!isDateFilterActive()}
                                >
                                    Сбросить даты
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={resetAllFilters}
                    className={styles.resetAllButton}
                    disabled={!managerFilter && !statusFilter && !regionFilter && !categoryFilter && !searchQuery && !isDateFilterActive()}
                >
                    <FaTimes /> Сбросить все
                </button>
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
                        <p className={styles.createDate}>
                            Создан: {new Date(client.createDate).toLocaleDateString('ru-RU')}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ClientList;