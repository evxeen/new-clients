import React, {useEffect, useState} from 'react';
import styles from "./ClientContacts.module.scss";
import {useOutletContext} from "react-router-dom";

function ClientContacts() {
    const { client } = useOutletContext();
    const [ updatedClient, setUpdatedClient ] = useState(client);

    useEffect(() => {
        setUpdatedClient(client);
    }, [client]);


    return (
        <div className={styles.container}>
            <div className={styles.list}>
                <p><strong>Юридический адрес:</strong> {client.address}</p>
                <p><strong>Сайт компании:</strong> {client.site}</p>
                <p><strong>Электронная почта компании:</strong> {client.email}</p>
                <p><strong>Номер телефона компании:</strong> {client.phone}</p>
                <p><strong>Контактные лица:</strong></p>
                <div className={styles.managersList}>
                    {updatedClient.contacts.length !== 0 ? updatedClient.contacts.map((contact, index) => (
                        <div
                            onClick={() => handleSetMainContact(index)}
                            key={index}
                            className={contact.isMain ? styles.managerActive : styles.manager}
                        >
                            <p>Имя: {contact.name || '—'}</p>
                            <p>Фамилия: {contact.lastName || '—'}</p>
                            <p>Должность: {contact.post || '—'}</p>
                            <p>Телефон: {contact.phone || '—'}</p>
                            <p>Email: {contact.email || '—'}</p>
                        </div>

                    )) : 'Список пуст '}
                    <div
                        className={styles.addIcon}
                        onClick={() => setShowModal(true)}
                        title="Добавить контакт"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.icon}
                            viewBox="0 0 24 24"
                        >
                            <g fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" d="M12 8v4m0 0v4m0-4h4m-4 0H8"/>
                                <circle cx="12" cy="12" r="10"/>
                            </g>
                        </svg>
                    </div>

                </div>
            </div>


        </div>
    );
}

export default ClientContacts;