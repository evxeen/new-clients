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

                {Object.keys(statusOptions).map((stage, i) => {
                    const [isHovered, setIsHovered] = useState(false); // 🔸 внутри map нельзя!

                    return (
                        <div
                            key={i}
                            className={styles.stageBlock}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={selectedStages.includes(stage)}
                                    onChange={() => toggleStage(stage)}
                                />
                                {stage}
                            </label>

                            {selectedStages.includes(stage) && isHovered && (
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
        </div>
    );
}

export default AddHistoryForm;
