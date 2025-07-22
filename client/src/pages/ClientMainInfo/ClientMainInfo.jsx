import React, {useEffect, useState} from 'react';
import styles from './ClientMainInfo.module.scss';
import {useOutletContext} from "react-router-dom";

function ClientMainInfo() {
    const { client } = useOutletContext();
    const [mainStatus, setMainStatus] = useState({});

    useEffect(() => {
        setMainStatus(client.mainStatus || {});
    }, [client?.mainStatus]); // Добавляем зависимость

    const handleSetMainStatus = async (newStatus) => {
        let status = newStatus;
        let comment = prompt('Введите текст');
        let result = {[status]: comment};

        setMainStatus(result);

        try {
            const res = await fetch(`/api/clients/${client.id}/main-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(result),
            });

            if (!res.ok) throw new Error("Ошибка при установке статуса");
        } catch (e) {
            console.log(e.message)
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.list}>
                <p><strong>Наименование компании:</strong> {client.company}</p>
                <p><strong>ИНН:</strong> {client.code}</p>
                <p><strong>Директор:</strong> {client.director}</p>
                <p><strong>Основание полномочий:</strong> {client.authority}</p>
                <p><strong>Заявленный объем (месяц):</strong> {client.volume} тонн</p>
                <p><strong>Менеджер:</strong> {client.manager}</p>
                <p><strong>Дата создания карточки:</strong> {client.createDate}</p>
            </div>
            <div className={styles.buttons}>
                <button onClick={() => handleSetMainStatus("potential")}>Потенциальный</button>
                <button onClick={() => handleSetMainStatus("marriage")}>Брак</button>
            </div>
        </div>
    );
}

export default ClientMainInfo;
