import React, { useEffect, useState } from 'react';
import styles from "./ClientContacts.module.scss";
import { useOutletContext } from "react-router-dom";

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
                            <p>WhatsApp: {contact.whatsApp || '—'}</p>
                            <p>Email: {contact.email || '—'}</p>
                        </div>
                    )) : 'Список пуст '}

                </div>
            </div>
        </div>
    );
}

export default ClientContacts;