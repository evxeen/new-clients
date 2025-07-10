import React from 'react';
import styles from "./ClientContacts.module.scss";
import {useOutletContext} from "react-router-dom";

function ClientContacts() {
    const { client } = useOutletContext();

    return (
        <div className={styles.container}>
            <div className={styles.list}>
                <p><strong>Юридический адрес:</strong> {client.address}</p>
                <p><strong>Сайт компании:</strong> {client.site}</p>
                <p><strong>Электронная почта компании:</strong> {client.email}</p>
                <p><strong>Номер телефона компании:</strong> {client.phone}</p>
                <p><strong>Менеджеры:</strong></p>
                <div className={styles.managersList}>
                    {client.contacts.map(contact => (
                        <div className={styles.manager}>
                            <p>Имя: {contact.name || '—'}</p>
                            <p>Фамилия: {contact.lastName || '—'}</p>
                            <p>Должность: {contact.post || '—'}</p>
                            <p>Телефон: {contact.phone || '—'}</p>
                            <p>Email: {contact.email || '—'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ClientContacts;