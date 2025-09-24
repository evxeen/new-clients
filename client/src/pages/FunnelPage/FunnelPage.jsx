// import React, { useEffect, useState } from 'react';
// import api from "../../api.js";
// import { Link } from "react-router-dom";
// import styles from './FunnelPage.module.scss';
// import { FaFilter, FaTimes, FaRedo, FaCalendarAlt } from "react-icons/fa";
// import { statusOptions } from "../../constants/historyOptions.js";
//
// const historyToArray = (history) => {
//     if (!history) return [];
//     if (Array.isArray(history)) return history;
//     return Object.values(history);
// };
//
// function getPipelineStatuses(history) {
//     const statuses = {};
//     const steps = Object.keys(statusOptions);
//
//     steps.forEach(step => {
//         statuses[step] = "—";
//     });
//
//     const historyArray = historyToArray(history);
//
//     if (historyArray.length === 0) {
//         return statuses;
//     }
//
//     historyArray.forEach(entry => {
//         entry.stages?.forEach(stageItem => {
//             if (steps.includes(stageItem.stage)) {
//                 statuses[stageItem.stage] = "выполнено";
//             }
//         });
//     });
//
//     return statuses;
// }
//
// function FunnelPage() {
//     const [clients, setClients] = useState([]);
//     const [filters, setFilters] = useState({});
//     const [archiveFilter, setArchiveFilter] = useState("all");
//     const [activeFilter, setActiveFilter] = useState(null);
//     const [expandedStages, setExpandedStages] = useState({});
//     const [managerFilter, setManagerFilter] = useState("all");
//     const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
//     const [showDateFilter, setShowDateFilter] = useState(false);
//
//     const toggleStageExpansion = (stage) => {
//         setExpandedStages(prev => ({
//             ...prev,
//             [stage]: !prev[stage]
//         }));
//     };
//
//     useEffect(() => {
//         api.get('/api/clients')
//             .then(res => {
//                 setClients(res.data);
//             })
//             .catch(err => console.error('Ошибка загрузки клиентов:', err));
//     }, []);
//
//     const steps = Object.keys(statusOptions);
//
//     const handleFilterChange = (step, value) => {
//         setFilters(prev => ({ ...prev, [step]: value }));
//         setActiveFilter(null);
//     };
//
//     const handleDateChange = (field, value) => {
//         setDateFilter(prev => ({ ...prev, [field]: value }));
//     };
//
//     const resetDateFilter = () => {
//         setDateFilter({ from: '', to: '' });
//         setShowDateFilter(false);
//     };
//
//     const isDateFilterActive = () => {
//         return dateFilter.from !== '' || dateFilter.to !== '';
//     };
//
//     const filteredClients = clients.filter(client => {
//         if (archiveFilter !== "all") {
//             const statusKey = Object.keys(client.mainStatus || {})[0];
//             if (statusKey !== archiveFilter) return false;
//         }
//
//         if (managerFilter !== "all" && client.manager !== managerFilter) {
//             return false;
//         }
//
//         // Фильтр по дате создания
//         if (isDateFilterActive()) {
//             const clientDate = new Date(client.createDate);
//
//             if (dateFilter.from) {
//                 const fromDate = new Date(dateFilter.from);
//                 fromDate.setHours(0, 0, 0, 0);
//                 if (clientDate < fromDate) return false;
//             }
//
//             if (dateFilter.to) {
//                 const toDate = new Date(dateFilter.to);
//                 toDate.setHours(23, 59, 59, 999);
//                 if (clientDate > toDate) return false;
//             }
//         }
//
//         const pipeline = getPipelineStatuses(client.history || []);
//         for (const step of steps) {
//             const filterVal = filters[step];
//             if (filterVal && filterVal !== "all") {
//                 if (pipeline[step] !== filterVal) return false;
//             }
//         }
//
//         return true;
//     });
//
//     const resetFilters = () => {
//         setFilters({});
//         setArchiveFilter("all");
//         setManagerFilter("all");
//         setDateFilter({ from: '', to: '' });
//         setShowDateFilter(false);
//         setActiveFilter(null);
//     };
//
//     const isFilterActive = () => {
//         return archiveFilter !== "all" ||
//             managerFilter !== "all" ||
//             Object.values(filters).some(f => f && f !== "all") ||
//             isDateFilterActive();
//     };
//
//     const managers = [...new Set(clients.map(client => client.manager).filter(Boolean))];
//
//     return (
//         <div className={styles.funnelPage}>
//             <div className={styles.header}>
//                 <Link className={styles.backLink} to="/">
//                     <FaTimes /> Назад
//                 </Link>
//
//                 <div className={styles.controls}>
//                     <div className={styles.dateFilter}>
//                         <button
//                             className={`${styles.dateFilterButton} ${isDateFilterActive() ? styles.activeFilter : ''}`}
//                             onClick={() => setShowDateFilter(!showDateFilter)}
//                         >
//                             <FaCalendarAlt /> Дата создания
//                         </button>
//
//                         {showDateFilter && (
//                             <div className={styles.dateFilterPopup}>
//                                 <div className={styles.dateInputs}>
//                                     <div className={styles.dateInputGroup}>
//                                         <label>От:</label>
//                                         <input
//                                             type="date"
//                                             value={dateFilter.from}
//                                             onChange={e => handleDateChange('from', e.target.value)}
//                                         />
//                                     </div>
//                                     <div className={styles.dateInputGroup}>
//                                         <label>До:</label>
//                                         <input
//                                             type="date"
//                                             value={dateFilter.to}
//                                             onChange={e => handleDateChange('to', e.target.value)}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className={styles.dateFilterActions}>
//                                     <button
//                                         onClick={resetDateFilter}
//                                         className={styles.resetDateButton}
//                                         disabled={!isDateFilterActive()}
//                                     >
//                                         Сбросить даты
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//
//                     <div className={styles.archiveFilter}>
//                         <label>Статус клиента:</label>
//                         <select
//                             value={archiveFilter}
//                             onChange={e => setArchiveFilter(e.target.value)}
//                             className={archiveFilter !== "all" ? styles.activeFilter : ""}
//                         >
//                             <option value="all">Все</option>
//                             <option value="active">Действующие</option>
//                             <option value="potential">Потенциальные</option>
//                             <option value="marriage">Отбракованы</option>
//                         </select>
//                     </div>
//
//                     <div className={styles.managerFilter}>
//                         <label>Исполнитель:</label>
//                         <select
//                             value={managerFilter}
//                             onChange={e => setManagerFilter(e.target.value)}
//                             className={managerFilter !== "all" ? styles.activeFilter : ""}
//                         >
//                             <option value="all">Все</option>
//                             {managers.map((manager, i) => (
//                                 <option key={i} value={manager}>{manager}</option>
//                             ))}
//                         </select>
//                     </div>
//
//                     <button
//                         onClick={resetFilters}
//                         className={`${styles.resetButton} ${isFilterActive() ? styles.active : ''}`}
//                         disabled={!isFilterActive()}
//                     >
//                         <FaRedo/> Сбросить фильтры
//                     </button>
//                 </div>
//             </div>
//
//             <div className={styles.tableWrapper}>
//                 <table className={styles.funnelTable}>
//                     <thead>
//                     <tr>
//                         <th className={styles.indexColumn}>№</th>
//                         <th className={styles.companyColumn}>Компания</th>
//                         {steps.map((step, i) => (
//                             <th key={i} className={styles.stepHeader}>
//                                 <div className={styles.stepTitle}>
//                                     <div className={styles.stageName}>
//                                         {step.split('. ').slice(1).join('. ')}
//                                     </div>
//                                     <div className={styles.stageNumber}>{step.split('.')[0]}.</div>
//                                     <button
//                                         className={`${styles.filterButton} ${filters[step] && filters[step] !== 'all' ? styles.active : ''}`}
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             setActiveFilter(activeFilter === step ? null : step);
//                                         }}
//                                     >
//                                         <FaFilter />
//                                     </button>
//                                 </div>
//
//                                 {activeFilter === step && (
//                                     <div className={styles.filterPopup}>
//                                         <select
//                                             value={filters[step] || "all"}
//                                             onChange={e => handleFilterChange(step, e.target.value)}
//                                         >
//                                             <option value="all">Все</option>
//                                             <option value="в процессе">В процессе</option>
//                                             <option value="выполнено">Выполнено</option>
//                                         </select>
//                                     </div>
//                                 )}
//
//                                 {filters[step] && filters[step] !== "all" && (
//                                     <div className={styles.activeFilterBadge}>
//                                         {filters[step]}
//                                     </div>
//                                 )}
//                             </th>
//                         ))}
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {filteredClients.map((client, index) => {
//                         const pipeline = getPipelineStatuses(client.history || {});
//                         return (
//                             <tr key={client.id}
//                                 className={
//                                     client.mainStatus?.marriage
//                                         ? styles.marriageRow
//                                         : client.mainStatus?.potential
//                                             ? styles.potentialRow
//                                             : client.mainStatus?.active
//                                                 ? styles.activeRow
//                                                 : ''
//                                 }>
//                                 <td className={styles.indexCell}>{index + 1}</td>
//                                 <td className={styles.companyCell}>
//                                     <Link className={styles.nameLink} to={`/client/${client.id}`}>
//                                         {client.company}
//                                     </Link>
//                                     <div className={styles.createDate}>
//                                         {new Date(client.createDate).toLocaleDateString('ru-RU')}
//                                     </div>
//                                 </td>
//                                 {steps.map((step, i) => (
//                                     <td
//                                         key={i}
//                                         className={`${styles.statusCell} ${styles[(pipeline[step] || 'empty').replace(/\s/g, '_')]}`}
//                                         title={`${step}: ${pipeline[step] || 'не начато'}`}
//                                     >
//                                         {pipeline[step] === 'выполнено' ? (
//                                             <span className={styles.statusIcon}>✓</span>
//                                         ) : pipeline[step] === 'в процессе' ? (
//                                             <span className={styles.statusIcon}>↻</span>
//                                         ) : (
//                                             <span className={styles.statusIcon}>—</span>
//                                         )}
//                                     </td>
//                                 ))}
//                             </tr>
//                         );
//                     })}
//                     </tbody>
//                     <tfoot>
//                     <tr>
//                         <td colSpan={2} className={styles.summaryLabel}>Итого по воронке:</td>
//                         {steps.map((step, i) => {
//                             const counts = {
//                                 "в процессе": 0,
//                                 "выполнено": 0
//                             };
//
//                             filteredClients.forEach(client => {
//                                 const pipeline = getPipelineStatuses(client.history || {});
//                                 const status = pipeline[step];
//                                 if (status && counts[status] !== undefined) {
//                                     counts[status]++;
//                                 }
//                             });
//
//                             return (
//                                 <td key={i} className={styles.summaryCell}>
//                                     <div className={styles.summaryItem}>
//                                         <span className={styles.summaryValue}>{counts["в процессе"]}</span>
//                                         <span className={styles.summaryLabel}>В пр.</span>
//                                     </div>
//                                     <div className={styles.summaryItem}>
//                                         <span className={styles.summaryValue}>{counts["выполнено"]}</span>
//                                         <span className={styles.summaryLabel}>Вып.</span>
//                                     </div>
//                                 </td>
//                             );
//                         })}
//                     </tr>
//                     </tfoot>
//                 </table>
//             </div>
//
//             {filteredClients.length === 0 && (
//                 <div className={styles.noResults}>
//                     <p>Клиенты по выбранным фильтрам не найдены</p>
//                     <button onClick={resetFilters}>
//                         Сбросить фильтры
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default FunnelPage;

import React, { useEffect, useState } from 'react';
import api from "../../api.js";
import { Link } from "react-router-dom";
import styles from './FunnelPage.module.scss';
import { FaFilter, FaTimes, FaRedo, FaCalendarAlt, FaHistory } from "react-icons/fa";
import { statusOptions } from "../../constants/historyOptions.js";

const historyToArray = (history) => {
    if (!history) return [];
    if (Array.isArray(history)) return history;
    return Object.values(history);
};

function getPipelineStatuses(history) {
    const statuses = {};
    const steps = Object.keys(statusOptions);

    steps.forEach(step => {
        statuses[step] = "—";
    });

    const historyArray = historyToArray(history);

    if (historyArray.length === 0) {
        return statuses;
    }

    historyArray.forEach(entry => {
        entry.stages?.forEach(stageItem => {
            if (steps.includes(stageItem.stage)) {
                statuses[stageItem.stage] = "выполнено";
            }
        });
    });

    return statuses;
}

// Функция для получения последней даты активности из истории
const getLastActivityDate = (history) => {
    if (!history) return null;

    const historyArray = historyToArray(history);
    if (historyArray.length === 0) return null;

    // Сортируем историю по дате (новые сначала)
    const sortedHistory = historyArray.sort((a, b) => {
        // Преобразуем дату из формата "DD.MM.YYYY HH:mm" в timestamp
        const parseDate = (dateStr) => {
            const [datePart, timePart] = dateStr.split(' ');
            const [day, month, year] = datePart.split('.');
            const [hours, minutes] = timePart.split(':');
            return new Date(year, month - 1, day, hours, minutes).getTime();
        };

        return parseDate(b.date) - parseDate(a.date);
    });

    return sortedHistory[0].date; // Возвращаем самую recent дату
};

// Функция для преобразования даты из формата "DD.MM.YYYY HH:mm" в Date объект
const parseHistoryDate = (dateStr) => {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('.');
    const [hours, minutes] = timePart.split(':');
    return new Date(year, month - 1, day, hours, minutes);
};

function FunnelPage() {
    const [clients, setClients] = useState([]);
    const [filters, setFilters] = useState({});
    const [archiveFilter, setArchiveFilter] = useState("all");
    const [activeFilter, setActiveFilter] = useState(null);
    const [expandedStages, setExpandedStages] = useState({});
    const [managerFilter, setManagerFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [lastActivityFilter, setLastActivityFilter] = useState({ from: '', to: '' });
    const [showLastActivityFilter, setShowLastActivityFilter] = useState(false);

    const toggleStageExpansion = (stage) => {
        setExpandedStages(prev => ({
            ...prev,
            [stage]: !prev[stage]
        }));
    };

    useEffect(() => {
        api.get('/api/clients')
            .then(res => {
                setClients(res.data);
            })
            .catch(err => console.error('Ошибка загрузки клиентов:', err));
    }, []);

    const steps = Object.keys(statusOptions);

    const handleFilterChange = (step, value) => {
        setFilters(prev => ({ ...prev, [step]: value }));
        setActiveFilter(null);
    };

    const handleDateChange = (field, value) => {
        setDateFilter(prev => ({ ...prev, [field]: value }));
    };

    const handleLastActivityChange = (field, value) => {
        setLastActivityFilter(prev => ({ ...prev, [field]: value }));
    };

    const resetDateFilter = () => {
        setDateFilter({ from: '', to: '' });
        setShowDateFilter(false);
    };

    const resetLastActivityFilter = () => {
        setLastActivityFilter({ from: '', to: '' });
        setShowLastActivityFilter(false);
    };

    const isDateFilterActive = () => {
        return dateFilter.from !== '' || dateFilter.to !== '';
    };

    const isLastActivityFilterActive = () => {
        return lastActivityFilter.from !== '' || lastActivityFilter.to !== '';
    };

    const filteredClients = clients.filter(client => {
        if (archiveFilter !== "all") {
            const statusKey = Object.keys(client.mainStatus || {})[0];
            if (statusKey !== archiveFilter) return false;
        }

        if (managerFilter !== "all" && client.manager !== managerFilter) {
            return false;
        }

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

        // Фильтр по дате последней активности
        if (isLastActivityFilterActive()) {
            const lastActivity = getLastActivityDate(client.history);

            // Если у клиента нет истории активности, но фильтр активен - исключаем его
            if (!lastActivity) return false;

            const lastActivityDate = parseHistoryDate(lastActivity);

            if (lastActivityFilter.from) {
                const fromDate = new Date(lastActivityFilter.from);
                fromDate.setHours(0, 0, 0, 0);
                if (lastActivityDate < fromDate) return false;
            }

            if (lastActivityFilter.to) {
                const toDate = new Date(lastActivityFilter.to);
                toDate.setHours(23, 59, 59, 999);
                if (lastActivityDate > toDate) return false;
            }
        }

        const pipeline = getPipelineStatuses(client.history || []);
        for (const step of steps) {
            const filterVal = filters[step];
            if (filterVal && filterVal !== "all") {
                if (pipeline[step] !== filterVal) return false;
            }
        }

        return true;
    });

    const resetFilters = () => {
        setFilters({});
        setArchiveFilter("all");
        setManagerFilter("all");
        setDateFilter({ from: '', to: '' });
        setLastActivityFilter({ from: '', to: '' });
        setShowDateFilter(false);
        setShowLastActivityFilter(false);
        setActiveFilter(null);
    };

    const isFilterActive = () => {
        return archiveFilter !== "all" ||
            managerFilter !== "all" ||
            Object.values(filters).some(f => f && f !== "all") ||
            isDateFilterActive() ||
            isLastActivityFilterActive();
    };

    const managers = [...new Set(clients.map(client => client.manager).filter(Boolean))];

    return (
        <div className={styles.funnelPage}>
            <div className={styles.header}>
                <Link className={styles.backLink} to="/">
                    <FaTimes /> Назад
                </Link>

                <div className={styles.controls}>
                    <div className={styles.dateFilter}>
                        <button
                            className={`${styles.dateFilterButton} ${isDateFilterActive() ? styles.activeFilter : ''}`}
                            onClick={() => {
                                setShowDateFilter(!showDateFilter);
                                setShowLastActivityFilter(false);
                            }}
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

                    <div className={styles.dateFilter}>
                        <button
                            className={`${styles.dateFilterButton} ${isLastActivityFilterActive() ? styles.activeFilter : ''}`}
                            onClick={() => {
                                setShowLastActivityFilter(!showLastActivityFilter);
                                setShowDateFilter(false);
                            }}
                        >
                            <FaHistory /> Последняя активность
                        </button>

                        {showLastActivityFilter && (
                            <div className={styles.dateFilterPopup}>
                                <div className={styles.dateInputs}>
                                    <div className={styles.dateInputGroup}>
                                        <label>От:</label>
                                        <input
                                            type="date"
                                            value={lastActivityFilter.from}
                                            onChange={e => handleLastActivityChange('from', e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.dateInputGroup}>
                                        <label>До:</label>
                                        <input
                                            type="date"
                                            value={lastActivityFilter.to}
                                            onChange={e => handleLastActivityChange('to', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.dateFilterActions}>
                                    <button
                                        onClick={resetLastActivityFilter}
                                        className={styles.resetDateButton}
                                        disabled={!isLastActivityFilterActive()}
                                    >
                                        Сбросить даты
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.archiveFilter}>
                        <label>Статус клиента:</label>
                        <select
                            value={archiveFilter}
                            onChange={e => setArchiveFilter(e.target.value)}
                            className={archiveFilter !== "all" ? styles.activeFilter : ""}
                        >
                            <option value="all">Все</option>
                            <option value="active">Действующие</option>
                            <option value="potential">Потенциальные</option>
                            <option value="marriage">Отбракованы</option>
                        </select>
                    </div>

                    <div className={styles.managerFilter}>
                        <label>Исполнитель:</label>
                        <select
                            value={managerFilter}
                            onChange={e => setManagerFilter(e.target.value)}
                            className={managerFilter !== "all" ? styles.activeFilter : ""}
                        >
                            <option value="all">Все</option>
                            {managers.map((manager, i) => (
                                <option key={i} value={manager}>{manager}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={resetFilters}
                        className={`${styles.resetButton} ${isFilterActive() ? styles.active : ''}`}
                        disabled={!isFilterActive()}
                    >
                        <FaRedo/> Сбросить фильтры
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.funnelTable}>
                    <thead>
                    <tr>
                        <th className={styles.indexColumn}>№</th>
                        <th className={styles.companyColumn}>Компания</th>
                        {steps.map((step, i) => (
                            <th key={i} className={styles.stepHeader}>
                                <div className={styles.stepTitle}>
                                    <div className={styles.stageName}>
                                        {step.split('. ').slice(1).join('. ')}
                                    </div>
                                    <div className={styles.stageNumber}>{step.split('.')[0]}.</div>
                                    <button
                                        className={`${styles.filterButton} ${filters[step] && filters[step] !== 'all' ? styles.active : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveFilter(activeFilter === step ? null : step);
                                        }}
                                    >
                                        <FaFilter />
                                    </button>
                                </div>

                                {activeFilter === step && (
                                    <div className={styles.filterPopup}>
                                        <select
                                            value={filters[step] || "all"}
                                            onChange={e => handleFilterChange(step, e.target.value)}
                                        >
                                            <option value="all">Все</option>
                                            <option value="в процессе">В процессе</option>
                                            <option value="выполнено">Выполнено</option>
                                        </select>
                                    </div>
                                )}

                                {filters[step] && filters[step] !== "all" && (
                                    <div className={styles.activeFilterBadge}>
                                        {filters[step]}
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredClients.map((client, index) => {
                        const pipeline = getPipelineStatuses(client.history || {});
                        const lastActivity = getLastActivityDate(client.history);
                        return (
                            <tr key={client.id}
                                className={
                                    client.mainStatus?.marriage
                                        ? styles.marriageRow
                                        : client.mainStatus?.potential
                                            ? styles.potentialRow
                                            : client.mainStatus?.active
                                                ? styles.activeRow
                                                : ''
                                }>
                                <td className={styles.indexCell}>{index + 1}</td>
                                <td className={styles.companyCell}>
                                    <Link className={styles.nameLink} to={`/client/${client.id}`}>
                                        {client.company}
                                    </Link>
                                    <div className={styles.createDate}>
                                        Создан: {new Date(client.createDate).toLocaleDateString('ru-RU')}
                                    </div>
                                    {lastActivity && (
                                        <div className={styles.lastActivityDate}>
                                            Активность: {lastActivity}
                                        </div>
                                    )}
                                </td>
                                {steps.map((step, i) => (
                                    <td
                                        key={i}
                                        className={`${styles.statusCell} ${styles[(pipeline[step] || 'empty').replace(/\s/g, '_')]}`}
                                        title={`${step}: ${pipeline[step] || 'не начато'}`}
                                    >
                                        {pipeline[step] === 'выполнено' ? (
                                            <span className={styles.statusIcon}>✓</span>
                                        ) : pipeline[step] === 'в процессе' ? (
                                            <span className={styles.statusIcon}>↻</span>
                                        ) : (
                                            <span className={styles.statusIcon}>—</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={2} className={styles.summaryLabel}>Итого по воронке:</td>
                        {steps.map((step, i) => {
                            const counts = {
                                "в процессе": 0,
                                "выполнено": 0
                            };

                            filteredClients.forEach(client => {
                                const pipeline = getPipelineStatuses(client.history || {});
                                const status = pipeline[step];
                                if (status && counts[status] !== undefined) {
                                    counts[status]++;
                                }
                            });

                            return (
                                <td key={i} className={styles.summaryCell}>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryValue}>{counts["в процессе"]}</span>
                                        <span className={styles.summaryLabel}>В пр.</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryValue}>{counts["выполнено"]}</span>
                                        <span className={styles.summaryLabel}>Вып.</span>
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                    </tfoot>
                </table>
            </div>

            {filteredClients.length === 0 && (
                <div className={styles.noResults}>
                    <p>Клиенты по выбранным фильтрам не найдены</p>
                    <button onClick={resetFilters}>
                        Сбросить фильтры
                    </button>
                </div>
            )}
        </div>
    );
}

export default FunnelPage;