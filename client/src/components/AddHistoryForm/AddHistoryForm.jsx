import React, { useState } from "react";
import styles from "./AddHistoryForm.module.scss";

import { statusOptions } from "../../constants/historyOptions.js";
import { FaCheck, FaPlus, FaCalendarAlt, FaComment, FaSave } from "react-icons/fa";
import {getMinskTime} from "../../../helpers/getMinskTime.js";

const formattedDate = getMinskTime();

const connectionOptions = ['по телефону', 'эл.почта', 'WhatsApp', 'LinkedIn', 'Очная встреча'];

function AddHistoryForm({ clientId, history, onHistoryAdd, onCancel }) {
    const [date] = useState(formattedDate);
    const [typeConnection, setTypeConnection] = useState('');
    const [selectedStages, setSelectedStages] = useState([]);
    const [selectedResults, setSelectedResults] = useState({});
    const [comment, setComment] = useState('');
    const [hoveredStage, setHoveredStage] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

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

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Ошибка при добавлении истории");
            }

            const responseData = await res.json();

            onHistoryAdd(responseData);


        } catch (err) {
            console.error(err);
            alert(err.message || "Не удалось сохранить историю");
        }
    };

    const completedStages = history?.reduce((acc, entry) => {
        entry.stages?.forEach(s => {
            if (!acc.includes(s.stage)) {
                acc.push(s.stage);
            }
        });
        return acc;
    }, []) || [];

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.header}>
                <h2><FaPlus /> Добавить запись в историю</h2>
            </div>

            <div className={styles.formGrid}>
                {/* Дата */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaCalendarAlt className={styles.icon} />
                        <h3>Дата</h3>
                    </div>
                    <div className={styles.dateDisplay}>{date}</div>
                </div>

                {/* Вид связи */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaComment className={styles.icon} />
                        <h3>Вид связи</h3>
                    </div>
                    <div className={styles.connectionGrid}>
                        {connectionOptions.map((el, i) => (
                            <label
                                key={i}
                                className={`${styles.radioLabel} ${typeConnection === el ? styles.checked : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="connection"
                                    value={el}
                                    checked={typeConnection === el}
                                    onChange={() => setTypeConnection(el)}
                                    className={styles.radioInput}
                                />
                                <span className={styles.radioCustom}></span>
                                {el}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Этапы */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaCheck className={styles.icon} />
                        <h3>Этапы</h3>
                    </div>
                    <div className={styles.stagesContainer}>
                        {Object.keys(statusOptions).map((stage, i) => {
                            const isCompleted = completedStages.includes(stage);
                            const isSelected = selectedStages.includes(stage);

                            return (
                                <div
                                    key={i}
                                    className={`${styles.stageItem} 
                                        ${isCompleted ? styles.completed : ''}
                                        ${isSelected ? styles.selected : ''}`}
                                    onMouseEnter={() => setHoveredStage(stage)}
                                    onMouseLeave={() => setHoveredStage(null)}
                                >
                                    <label className={styles.stageLabel}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleStage(stage)}
                                            className={styles.checkboxInput}
                                        />
                                        <span className={styles.checkboxCustom}></span>
                                        {stage}
                                    </label>

                                    {isSelected && hoveredStage === stage && (
                                        <div className={styles.resultsDropdown}>
                                            <div className={styles.resultsHeader}>Выберите результаты:</div>
                                            {statusOptions[stage].map((result, j) => (
                                                <label
                                                    key={j}
                                                    className={styles.resultItem}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedResults[stage]?.includes(result) || false}
                                                        onChange={() => toggleResult(stage, result)}
                                                        className={styles.resultCheckbox}
                                                    />
                                                    <span className={styles.resultCustom}></span>
                                                    {result}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Комментарий */}
                <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <FaComment className={styles.icon} />
                        <h3>Комментарий</h3>
                    </div>
                    <textarea
                        className={styles.commentTextarea}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Введите комментарий к взаимодействию..."
                        rows={4}
                    />
                </div>
            </div>

            {/* Кнопки */}
            <div className={styles.formActions}>
                <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={onCancel}
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!typeConnection || selectedStages.length === 0}
                >
                    <FaSave /> Сохранить
                </button>
            </div>
        </form>
    );
}

export default AddHistoryForm;
