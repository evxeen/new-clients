import React from 'react';
import styles from "./ClientHistory.module.scss";
import { useOutletContext } from "react-router-dom";
import AddHistoryForm from "../../components/AddHistoryForm/AddHistoryForm.jsx";

function ClientHistory() {
    const { client, setClient } = useOutletContext();
    const reversed = client.history.slice().reverse();

    const handleAddHistory = (newEntry) => {
        setClient(prev => ({
            ...prev,
            history: [...prev.history, newEntry]
        }));
    };

    const currentMainStatus = Object.keys(client.mainStatus || {})[0];

    return (
        <div className={styles.container}>
            {currentMainStatus === "active" ? (
                <>
                    <AddHistoryForm
                        clientId={client.id}
                        history={client.history}
                        onHistoryAdd={handleAddHistory}
                    />
                    {reversed.map((el, i) => (
                        <div key={i} className={styles.story}>
                            <p className={styles.storyDate}>{el.date}</p>
                            <div className={styles.storyStatus}>
                                <p>{el.status}</p>
                                <p>{el.result}</p>
                            </div>
                            <p className={styles.storyConnection}>{el.typeOfConnection}</p>
                            <p className={styles.storyMessage}>{el.message}</p>
                        </div>
                    ))}
                </>
            ) : (
                <p>
                    Чтобы добавлять историю, статус клиента должен быть <strong>Активный</strong>.
                </p>
            )}
        </div>
    );
}

export default ClientHistory;
