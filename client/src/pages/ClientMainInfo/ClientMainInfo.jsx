import React from 'react';
import styles from './ClientMainInfo.module.scss';
import {useOutletContext} from "react-router-dom";

function ClientMainInfo() {
    const { client } = useOutletContext();

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
        </div>
    );
}

export default ClientMainInfo;
