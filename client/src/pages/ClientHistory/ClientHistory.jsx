import React, {useState, useEffect} from 'react';
import styles from "./ClientHistory.module.scss";

import {useOutletContext} from "react-router-dom";
import AddHistoryForm from "../../components/AddHistoryForm/AddHistoryForm.jsx";

function ClientHistory() {
    const context = useOutletContext();
    const [client, setClient] = useState(context.client);
    const reversed = client.history.slice().reverse();

    useEffect(() => {
        setClient(context.client); // если данные снаружи обновятся — обновим и локальные
    }, [context.client]);

    const handleAddHistory = (newEntry) => {
        setClient(prev => ({
            ...prev,
            history: [...prev.history, newEntry]
        }));
    };

    return (
        <div className={styles.container}>
            <AddHistoryForm clientId={client.id} history={client.history} onHistoryAdd={handleAddHistory}/>
            {reversed.map(el => (
                <div key={el.message} className={styles.story}>
                    <p className={styles.storyDate}>{el.date}</p>
                    <div className={styles.storyStatus}>
                        <p>{el.status}</p>
                        <p>{el.result}</p>
                    </div>
                    <p className={styles.storyConnection}>{el.typeOfConnection}</p>
                    <p className={styles.storyMessage}>{el.message}</p>
                </div>
            ))}
        </div>
    );
}

export default ClientHistory;