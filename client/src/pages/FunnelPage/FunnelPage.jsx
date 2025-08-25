import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import styles from './FunnelPage.module.scss';
import { FaFilter, FaTimes, FaRedo } from "react-icons/fa";
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

function FunnelPage() {
    const [clients, setClients] = useState([]);
    const [filters, setFilters] = useState({});
    const [archiveFilter, setArchiveFilter] = useState("all");
    const [activeFilter, setActiveFilter] = useState(null);
    const [expandedStages, setExpandedStages] = useState({});

    const toggleStageExpansion = (stage) => {
        setExpandedStages(prev => ({
            ...prev,
            [stage]: !prev[stage]
        }));
    };

    useEffect(() => {
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(err => console.error('Ошибка загрузки клиентов:', err));
    }, []);

    const steps = Object.keys(statusOptions);

    const handleFilterChange = (step, value) => {
        setFilters(prev => ({ ...prev, [step]: value }));
        setActiveFilter(null);
    };

    const filteredClients = clients.filter(client => {
        if (archiveFilter !== "all") {
            const statusKey = Object.keys(client.mainStatus || {})[0];
            if (statusKey !== archiveFilter) {
                return false;
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
        setActiveFilter(null);
    }

    const isFilterActive = () => {
        return archiveFilter !== "all" || Object.values(filters).some(f => f && f !== "all");
    }

    return (
        <div className={styles.funnelPage}>
            <div className={styles.header}>
                <Link className={styles.backLink} to="/">
                    <FaTimes /> Назад
                </Link>

                <div className={styles.controls}>
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

                    <button
                        onClick={resetFilters}
                        className={`${styles.resetButton} ${isFilterActive() ? styles.active : ''}`}
                        disabled={!isFilterActive()}
                    >
                        <FaRedo /> Сбросить фильтры
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