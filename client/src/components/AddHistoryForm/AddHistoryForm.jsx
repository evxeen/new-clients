import React, { useState } from "react";
import { statusOptions } from "../../constants/historyOptions.js";
import styles from "./AddHistoryForm.module.scss";

function AddHistoryForm({ clientId, history, onHistoryAdd }) {
    const [status, setStatus] = useState("");
    const [result, setResult] = useState("");
    const [typeOfConnection, setTypeOfConnection] = useState("по телефону");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const date = new Date();
        date.setHours(date.getHours() + 3); // сдвиг на +3 часа
        const formattedDate = date.toISOString().slice(0, 16).replace("T", " ");

        const isArchived = result === "В архив";

        const newHistory = {
            date: formattedDate,
            status,
            result,
            typeOfConnection,
            message,
        };

        try {
            const res = await fetch(`/api/clients/${clientId}/history`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newHistory),
            });

            if (!res.ok) throw new Error("Ошибка при отправке истории");

            onHistoryAdd(newHistory);

            setStatus("");
            setResult("");
            setMessage("");

        } catch (error) {
            alert("Ошибка: " + error.message);
        }
    };


    const getAvailableStatuses = () => {
        const allSteps = Object.keys(statusOptions);

        if (history.length === 0) return [allSteps[0]];

        // Найдём самый последний индекс этапа, который хотя бы раз был выбран
        let lastUsedIndex = -1;

        history.forEach(entry => {
            const index = allSteps.indexOf(entry.status);
            if (index > lastUsedIndex) {
                lastUsedIndex = index;
            }
        });

        return allSteps.slice(lastUsedIndex); // Возвращаем текущий и все после
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                <option value="" disabled>Выберите этап</option>
                {Object.keys(statusOptions).map((key) => {
                    const isAvailable = getAvailableStatuses().includes(key);
                    return (
                        <option
                            key={key}
                            value={key}
                            disabled={!isAvailable}
                            className={isAvailable ? styles.currentStep : styles.disabledOption}
                        >
                            {key}
                        </option>
                    );
                })}
            </select>

            <select value={typeOfConnection} onChange={(e) => setTypeOfConnection(e.target.value)}>
                <option value="по телефону">по телефону</option>
                <option value="эл.почта">эл.почта</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Очная встреча">Очная встреча</option>
            </select>

            {status && (
                <select value={result} onChange={(e) => setResult(e.target.value)} required>
                    <option value="" disabled>Выберите результат</option>
                    {statusOptions[status].map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            )}


            <textarea placeholder='Введите комментарий' value={message} onChange={(e) => setMessage(e.target.value)}
                      required/>

            <button type="submit">Добавить</button>
        </form>
    );
}

export default AddHistoryForm;
