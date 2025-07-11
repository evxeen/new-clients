import React, {useEffect, useState} from 'react';
import styles from "./ClientContacts.module.scss";
import {useOutletContext} from "react-router-dom";
import AddContactForm from "../../components/AddContactForm/AddContactForm.jsx";

function ClientContacts() {
    const { client } = useOutletContext();
    const [ updatedClient, setUpdatedClient ] = useState(client);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        setUpdatedClient(client);
    }, [client]);

    const handleSetMainContact = (index) => {
        fetch(`/api/clients/${client.id}/main-contact`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mainIndex: index })
        })
            .then(res => res.json())
            .then(updated => {
                setUpdatedClient(updated);
            })
            .catch(err => {
                console.error('Ошибка при обновлении основного контакта:', err);
            });
    };

    const handleAddContact = (newContact) => {
        fetch(`/api/clients/${client.id}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        })
            .then(res => res.json())
            .then(updated => {
                setUpdatedClient(updated);
            })
            .catch(err => {
                console.error('Ошибка при добавлении контакта:', err);
            });
    };

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
                    {/*<button onClick={() => setShowModal(true)}>Добавить контакт</button>*/}
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

            {showModal ? <AddContactForm onSubmit={handleAddContact} onClose={setShowModal}/> : ''}
        </div>
    );
}

export default ClientContacts;