// import React, {useState} from 'react';
// import styles from "./ClientHistory.module.scss";
// import { useOutletContext } from "react-router-dom";
// import AddHistoryForm from "../../components/AddHistoryForm/AddHistoryForm.jsx";
//
// function ClientHistory() {
//     const { client, setClient } = useOutletContext();
//     const reversed = client.history.slice().reverse();
//     const [formIsVisible, setFormIsVisible] = useState(false);
//
//     const handleAddHistory = (newEntry) => {
//         setClient(prev => ({
//             ...prev,
//             history: [...prev.history, newEntry]
//         }));
//     };
//
//     const currentMainStatus = Object.keys(client.mainStatus || {})[0];
//
//     return (
//         <div className={styles.container}>
//             {currentMainStatus === "active" ? (
//                 <>
//                     {formIsVisible ?
//                         <AddHistoryForm
//                             clientId={client.id}
//                             history={client.history}
//                             onHistoryAdd={handleAddHistory}
//                         />
//                         :
//                         <button onClick={() => setFormIsVisible(!formIsVisible)}>Добавить</button>
//                     }
//
//                     {reversed.map((el, i) => (
//                         <div key={i} className={styles.story}>
//                             <p className={styles.storyDate}>{el.date}</p>
//                             <div className={styles.storyStatus}>
//                                 <p>{el.status}</p>
//                                 <p>{el.result}</p>
//                             </div>
//                             <p className={styles.storyConnection}>{el.typeOfConnection}</p>
//                             <p className={styles.storyMessage}>{el.message}</p>
//                         </div>
//                     ))}
//                 </>
//             ) : (
//                 <p>
//                     Чтобы добавлять историю, статус клиента должен быть <strong>Активный</strong>.
//                 </p>
//             )}
//         </div>
//     );
// }
//
// export default ClientHistory;

import React, { useState } from 'react';
import styles from "./ClientHistory.module.scss";
import { useOutletContext } from "react-router-dom";
import AddHistoryForm from "../../components/AddHistoryForm/AddHistoryForm.jsx";

function ClientHistory() {
    const { client, setClient } = useOutletContext();
    const reversed = (client.history || []).slice().reverse();
    const [formIsVisible, setFormIsVisible] = useState(false);

    const handleAddHistory = (newEntry) => {
        setClient(prev => ({
            ...prev,
            history: [...(prev.history || []), newEntry]
        }));
    };

    const currentMainStatus = Object.keys(client.mainStatus || {})[0];

    return (
        <div className={styles.container}>
            {currentMainStatus === "active" ? (
                <>
                    {formIsVisible ? (
                        <AddHistoryForm
                            clientId={client.id}
                            history={client.history}
                            onHistoryAdd={handleAddHistory}
                        />
                    ) : (
                        <button onClick={() => setFormIsVisible(true)}>Добавить</button>
                    )}
                </>
            ) : (
                <p>
                    Чтобы добавлять историю, статус клиента должен быть <strong>Активный</strong>.
                </p>
            )}
            {reversed.map((entry, i) => (
                <div key={i} className={styles.story}>
                    {/* Дата и тип связи */}
                    <div className={styles.storyHeader}>
                        <p className={styles.storyDate}>{entry.date}</p>
                        <p className={styles.storyConnection}>{entry.typeConnection}</p>
                    </div>

                    {/* Этапы и результаты */}
                    <div className={styles.storyStages}>
                        {entry.stages?.map((stageItem, idx) => (
                            <div key={idx} className={styles.stageBlock}>
                                <p className={styles.stageName}>{stageItem.stage}</p>
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

                    {/* Комментарий */}
                    {entry.comment && (
                        <p className={styles.storyMessage}>{entry.comment}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ClientHistory;
