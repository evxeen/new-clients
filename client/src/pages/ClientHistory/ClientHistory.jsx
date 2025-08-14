import React, { useState, useEffect } from 'react';
import styles from "./ClientHistory.module.scss";
import { useOutletContext } from "react-router-dom";
import AddHistoryForm from "../../components/AddHistoryForm/AddHistoryForm.jsx";
import { FaPlus, FaHistory } from "react-icons/fa";

function ClientHistory() {
    const { client, setClient } = useOutletContext();
    const [history, setHistory] = useState([]);
    const [formIsVisible, setFormIsVisible] = useState(false);
    const [highlightedId, setHighlightedId] = useState(null);

    useEffect(() => {
        if (client.history) {
            const historyArray = Object.values(client.history)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            setHistory(historyArray.reverse());
        } else {
            setHistory([]);
        }
    }, [client]);

    const handleAddHistory = (newEntry) => {
        setClient(prev => ({
            ...prev,
            history: {
                ...prev.history,
                [newEntry.id]: newEntry
            }
        }));

        setHighlightedId(newEntry.id);
        setTimeout(() => setHighlightedId(null), 3000);
        setFormIsVisible(false);
    };

    const currentMainStatus = Object.keys(client.mainStatus || {})[0];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2><FaHistory /> История взаимодействий</h2>

                {currentMainStatus === "active" && !formIsVisible && (
                    <button
                        className={styles.addButton}
                        onClick={() => setFormIsVisible(true)}
                    >
                        <FaPlus /> Добавить запись
                    </button>
                )}
            </div>

            {currentMainStatus !== "active" && (
                <div className={styles.statusWarning}>
                    <p>
                        Чтобы добавлять историю, статус клиента должен быть <strong>Активный</strong>.
                    </p>
                </div>
            )}

            {formIsVisible && (
                <div className={styles.formContainer}>
                    <AddHistoryForm
                        clientId={client.id}
                        history={history}
                        onHistoryAdd={handleAddHistory}
                        onCancel={() => setFormIsVisible(false)}
                    />
                </div>
            )}

            <div className={styles.historyList}>
                {history.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>История взаимодействий отсутствует</p>
                    </div>
                ) : (
                    history.map((entry) => (
                        <div
                            key={entry.id}
                            className={`${styles.storyCard} ${
                                highlightedId === entry.id ? styles.highlighted : ''
                            }`}
                        >
                            <div className={styles.storyHeader}>
                                <span className={styles.storyDate}>{entry.date}</span>
                                <span className={styles.connectionBadge}>
                                    {entry.typeConnection}
                                </span>
                            </div>

                            <div className={styles.storyContent}>
                                {entry.stages?.map((stageItem, idx) => (
                                    <div key={idx} className={styles.stageBlock}>
                                        <h3 className={styles.stageTitle}>{stageItem.stage}</h3>
                                        <ul className={styles.resultsList}>
                                            {stageItem.results.map((res, rIdx) => (
                                                <li key={rIdx} className={styles.resultItem}>
                                                    {res}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {entry.comment && (
                                <div className={styles.commentSection}>
                                    <div className={styles.commentLabel}>Комментарий:</div>
                                    <p className={styles.commentText}>{entry.comment}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ClientHistory;
