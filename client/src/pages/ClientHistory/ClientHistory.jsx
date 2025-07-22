import React from 'react';
import styles from "./ClientHistory.module.scss";

import {useOutletContext} from "react-router-dom";
import AddHistoryForm from "../../components/AddHistoryForm/AddHistoryForm.jsx";

function ClientHistory() {
    const { client } = useOutletContext();
    const reversed = client.history.slice().reverse();

    return (

        <div className={styles.container}>
            <AddHistoryForm clientId={client.id} history={client.history}/>
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