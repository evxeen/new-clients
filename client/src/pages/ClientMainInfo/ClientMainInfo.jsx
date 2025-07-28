import React, {useEffect, useState} from 'react';
import styles from './ClientMainInfo.module.scss';
import {useOutletContext} from "react-router-dom";

function ClientMainInfo() {
    const { client } = useOutletContext();
    const [mainStatus, setMainStatus] = useState({});

    useEffect(() => {
        setMainStatus(client.mainStatus || {});
    }, [client?.mainStatus]);

    const handleSetMainStatus = async (newStatus) => {
        let comment = "";

        if (newStatus !== "active") {
            comment = prompt("Введите причину");
            if (!comment) {
                alert("Необходимо ввести причину!");
                return;
            }
        }

        const result = { [newStatus]: comment };

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

    switch (mainStatus) {

    }

    let status = (() => {
        switch (Object.keys(mainStatus)[0]) {
            case "active":
                return "Активный";
            case "potential":
                return "Потенциальный";
            case "marriage":
                return "Отбракован";
            default:
                return "Неизвестно";
        }
    })();

    console.log(client)

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
                <p><strong>Статус:</strong> {status}</p>

            </div>
            <div className={styles.buttons}>
                <button onClick={() => handleSetMainStatus("potential")}>Потенциальный</button>
                <button onClick={() => handleSetMainStatus("marriage")}>Брак</button>
                <button onClick={() => handleSetMainStatus("active")}>Активный</button>
            </div>
        </div>
    );
}

export default ClientMainInfo;
