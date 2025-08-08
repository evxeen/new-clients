// import React, { useState } from "react";
// import { statusOptions } from "../../constants/historyOptions.js";
// import styles from "./AddHistoryForm.module.scss";
//
// const generateDate = new Date();
// generateDate.setHours(generateDate.getHours() + 3);
//
// const day = String(generateDate.getDate()).padStart(2, '0');
// const month = String(generateDate.getMonth() + 1).padStart(2, '0');
// const year = generateDate.getFullYear();
// const hours = String(generateDate.getHours()).padStart(2, '0');
// const minutes = String(generateDate.getMinutes()).padStart(2, '0');
// const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
//
// const connectionOptions = ['по телефону', 'эл.почта', 'WhatsApp', 'LinkedIn', 'Очная встреча'];
//
// function AddHistoryForm({ clientId, history, onHistoryAdd }) {
//     const [date] = useState(formattedDate);
//     const [typeConnection, setTypeConnection] = useState('');
//     const [selectedStages, setSelectedStages] = useState([]);
//     const [selectedResults, setSelectedResults] = useState({});
//     const [comment, setComment] = useState('');
//
//     const toggleStage = (stage) => {
//         setSelectedStages((prev) =>
//             prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
//         );
//         if (!selectedStages.includes(stage)) {
//             setSelectedResults((prev) => ({ ...prev, [stage]: [] }));
//         }
//     };
//
//     const toggleResult = (stage, result) => {
//         setSelectedResults((prev) => {
//             const currentResults = prev[stage] || [];
//             const updated = currentResults.includes(result)
//                 ? currentResults.filter((r) => r !== result)
//                 : [...currentResults, result];
//             return { ...prev, [stage]: updated };
//         });
//     };
//
//     return (
//         <div className={styles.container}>
//             {/* Дата */}
//             <div className={styles.column}>
//                 <h4>Дата</h4>
//                 <p>{date}</p>
//             </div>
//
//             {/* Вид связи */}
//             <div className={styles.column}>
//                 <h4>Вид связи</h4>
//                 {connectionOptions.map((el, i) => (
//                     <label key={i} className={styles.checkboxLabel}>
//                         <input
//                             type="radio"
//                             name="connection"
//                             value={el}
//                             checked={typeConnection === el}
//                             onChange={() => setTypeConnection(el)}
//                         />
//                         {el}
//                     </label>
//                 ))}
//             </div>
//
//             {/* Этапы */}
//             <div className={styles.column}>
//                 <h4>Этапы</h4>
//
//                 {Object.keys(statusOptions).map((stage, i) => {
//                     const [isHovered, setIsHovered] = useState(false); // 🔸 внутри map нельзя!
//
//                     return (
//                         <div
//                             key={i}
//                             className={styles.stageBlock}
//                             onMouseEnter={() => setIsHovered(true)}
//                             onMouseLeave={() => setIsHovered(false)}
//                         >
//                             <label className={styles.checkboxLabel}>
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedStages.includes(stage)}
//                                     onChange={() => toggleStage(stage)}
//                                 />
//                                 {stage}
//                             </label>
//
//                             {selectedStages.includes(stage) && isHovered && (
//                                 <div className={styles.resultsPopup}>
//                                     {statusOptions[stage].map((result, j) => (
//                                         <label key={j} className={styles.checkboxLabel}>
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedResults[stage]?.includes(result) || false}
//                                                 onChange={() => toggleResult(stage, result)}
//                                             />
//                                             {result}
//                                         </label>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//
//             </div>
//
//             {/* Комментарий */}
//             <div className={styles.column} style={{ flexGrow: 1 }}>
//                 <h4>Комментарий</h4>
//                 <textarea
//                     className={styles.commentField}
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     placeholder="Введите комментарий..."
//                 />
//             </div>
//         </div>
//     );
// }
//
// export default AddHistoryForm;

import React, { useState } from "react";
import { statusOptions } from "../../constants/historyOptions.js";
import styles from "./AddHistoryForm.module.scss";

const generateDate = new Date();
generateDate.setHours(generateDate.getHours() + 3);

const day = String(generateDate.getDate()).padStart(2, '0');
const month = String(generateDate.getMonth() + 1).padStart(2, '0');
const year = generateDate.getFullYear();
const hours = String(generateDate.getHours()).padStart(2, '0');
const minutes = String(generateDate.getMinutes()).padStart(2, '0');
const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

const connectionOptions = ['по телефону', 'эл.почта', 'WhatsApp', 'LinkedIn', 'Очная встреча'];

function AddHistoryForm({ clientId, history, onHistoryAdd }) {
    const [date] = useState(formattedDate);
    const [typeConnection, setTypeConnection] = useState('');
    const [selectedStages, setSelectedStages] = useState([]);
    const [selectedResults, setSelectedResults] = useState({});
    const [comment, setComment] = useState('');
    const [hoveredStage, setHoveredStage] = useState(null); // 👈 вынесено из map

    const toggleStage = (stage) => {
        setSelectedStages((prev) =>
            prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
        );
        if (!selectedStages.includes(stage)) {
            setSelectedResults((prev) => ({ ...prev, [stage]: [] }));
        }
    };

    const toggleResult = (stage, result) => {
        setSelectedResults((prev) => {
            const currentResults = prev[stage] || [];
            const updated = currentResults.includes(result)
                ? currentResults.filter((r) => r !== result)
                : [...currentResults, result];
            return { ...prev, [stage]: updated };
        });
    };

    const handleSubmit = async () => {
        const newEntry = {
            date,
            typeConnection,
            stages: selectedStages.map(stage => ({
                stage,
                results: selectedResults[stage] || []
            })),
            comment
        };

        try {
            const res = await fetch(`/api/clients/${clientId}/history`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEntry)
            });

            if (!res.ok) throw new Error("Ошибка при добавлении истории");

            const updatedClient = await res.json();
            onHistoryAdd(updatedClient.history); // обновляем историю на фронте
            setTypeConnection("");
            setSelectedStages([]);
            setSelectedResults({});
            setComment("");
        } catch (err) {
            console.error(err);
            alert("Не удалось сохранить историю");
        }
    };

    // Вычисляем завершенные этапы
    const completedStages = history?.reduce((acc, entry) => {
        entry.stages?.forEach(s => {
            if (!acc.includes(s.stage)) {
                acc.push(s.stage);
            }
        });
        return acc;
    }, []) || [];

    return (
        <div className={styles.container}>
            {/* Дата */}
            <div className={styles.column}>
                <h4>Дата</h4>
                <p>{date}</p>
            </div>

            {/* Вид связи */}
            <div className={styles.column}>
                <h4>Вид связи</h4>
                {connectionOptions.map((el, i) => (
                    <label key={i} className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            name="connection"
                            value={el}
                            checked={typeConnection === el}
                            onChange={() => setTypeConnection(el)}
                        />
                        {el}
                    </label>
                ))}
            </div>

            {/* Этапы */}
            <div className={styles.column}>
                <h4>Этапы</h4>

                {/*{Object.keys(statusOptions).map((stage, i) => (*/}
                {/*    <div*/}
                {/*        key={i}*/}
                {/*        className={styles.stageBlock}*/}
                {/*        onMouseEnter={() => setHoveredStage(stage)}*/}
                {/*        onMouseLeave={() => setHoveredStage(null)}*/}
                {/*    >*/}
                {/*        <label className={styles.checkboxLabel}>*/}
                {/*            <input*/}
                {/*                type="checkbox"*/}
                {/*                checked={selectedStages.includes(stage)}*/}
                {/*                onChange={() => toggleStage(stage)}*/}
                {/*            />*/}
                {/*            {stage}*/}
                {/*        </label>*/}

                {/*        {selectedStages.includes(stage) && hoveredStage === stage && (*/}
                {/*            <div className={styles.resultsPopup}>*/}
                {/*                {statusOptions[stage].map((result, j) => (*/}
                {/*                    <label key={j} className={styles.checkboxLabel}>*/}
                {/*                        <input*/}
                {/*                            type="checkbox"*/}
                {/*                            checked={selectedResults[stage]?.includes(result) || false}*/}
                {/*                            onChange={() => toggleResult(stage, result)}*/}
                {/*                        />*/}
                {/*                        {result}*/}
                {/*                    </label>*/}
                {/*                ))}*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*))}*/}

                {Object.keys(statusOptions).map((stage, i) => {
                    const isCompleted = completedStages.includes(stage);

                    return (
                        <div
                            key={i}
                            className={`${styles.stageBlock} ${isCompleted ? styles.completedStage : ""}`}
                            onMouseEnter={() => setHoveredStage(stage)}
                            onMouseLeave={() => setHoveredStage(null)}
                        >
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={selectedStages.includes(stage)}
                                    onChange={() => toggleStage(stage)}
                                    disabled={isCompleted} // 👈 блокируем выбор
                                />
                                {stage}
                            </label>

                            {selectedStages.includes(stage) && hoveredStage === stage && (
                                <div className={styles.resultsPopup}>
                                    {statusOptions[stage].map((result, j) => (
                                        <label key={j} className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={selectedResults[stage]?.includes(result) || false}
                                                onChange={() => toggleResult(stage, result)}
                                            />
                                            {result}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

            </div>

            {/* Комментарий */}
            <div className={styles.column} style={{ flexGrow: 1 }}>
                <h4>Комментарий</h4>
                <textarea
                    className={styles.commentField}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Введите комментарий..."
                />
            </div>

            {/* Кнопка */}
            <div className={styles.column} style={{ alignSelf: "flex-end" }}>
                <button onClick={handleSubmit}>Сохранить</button>
            </div>
        </div>
    );
}

export default AddHistoryForm;
