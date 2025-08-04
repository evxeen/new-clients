import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import styles from './FunnelPage.module.scss';

import { statusOptions } from "../../constants/historyOptions.js";

function getPipelineStatuses(history) {
    const statuses = {};
    const steps = Object.keys(statusOptions);

    if (!history || history.length === 0) {
        steps.forEach(step => statuses[step] = null);
        return statuses;
    }

    const lastEntry = history[history.length - 1];
    const lastStepIndex = steps.indexOf(lastEntry.status);


    for (let i = 0; i < lastStepIndex; i++) {
        statuses[steps[i]] = "выполнено";
    }

    const currentStep = steps[lastStepIndex];
    const stepResults = history
        .filter(h => h.status === currentStep)
        .map(h => h.result);

    const isCompleted = stepResults.includes(statusOptions[currentStep].at(-1));
    statuses[currentStep] = isCompleted ? "выполнено" : "в процессе";

    for (let i = lastStepIndex + 1; i < steps.length; i++) {
        statuses[steps[i]] = null;
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
    }

    return (
        <div className={styles.funnelContainer}>
            <Link className={styles.backLink} to="/">Назад</Link>
            <div className={styles.filters}>
                <div>
                    <label>Архив:</label>
                    <select value={archiveFilter} onChange={e => setArchiveFilter(e.target.value)}>
                        <option value="all">Все</option>
                        <option value="active">Действующие</option>
                        <option value="potential">Потенциальные</option>
                        <option value="marriage">Отбракованы</option>
                    </select>
                </div>
                {steps.map(step => (
                    <div key={step}>
                        <label>{step}</label>
                        <select value={filters[step] || "all"} onChange={e => handleFilterChange(step, e.target.value)}>
                            <option value="all">Все</option>
                            <option value="в процессе">В процессе</option>
                            <option value="выполнено">Выполнено</option>
                        </select>
                    </div>
                ))}

                <button onClick={resetFilters}>Сбросить</button>
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
                        <tr   key={client.id}
                              className={
                                  client.mainStatus?.marriage
                                      ? styles.marriageRow
                                      : client.mainStatus?.potential
                                          ? styles.potentialRow
                                          : client.mainStatus?.active
                                              ? styles.activeRow
                                              : ''
                              }>
                            <td>{index + 1}</td>
                            <td><Link className={styles.nameLink} to={`/client/${client.id}`}>{client.company}</Link> </td>
                            {steps.map((step, i) => (
                                <td key={i} className={styles[(pipeline[step] || 'empty').replace(/\s/g, '_')]}>
                                    {pipeline[step] || '—'}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={2}>Итого:</td>
                    {steps.map((step, i) => {
                        const counts = {"начато": 0, "в процессе": 0, "выполнено": 0};

                        filteredClients.forEach(client => {
                            const pipeline = getPipelineStatuses(client.history || []);
                            const status = pipeline[step];
                            if (status && counts[status] !== undefined) {
                                counts[status]++;
                            }
                        });

                        return (
                            <td key={i}>
                                <div>В процессе: {counts["в процессе"]}</div>
                                <div>Выполнено: {counts["выполнено"]}</div>
                            </td>
                        );
                    })}
                </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default FunnelPage;
