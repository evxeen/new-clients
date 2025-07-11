import React, { useEffect, useState } from 'react';
import {data, Link} from 'react-router-dom';
import styles from './ClientList.module.scss'
import AddClientForm from "../../components/AddClientForm/AddClientForm.jsx";

function ClientList() {
  const [clients, setClients] = useState([]);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => setClients(data.reverse()))
      .catch((err) => console.error('Ошибка загрузки клиентов:', err));
  }, []);

  const toggleForm = (isOpen) => {
      setFormIsOpen(isOpen)
  }

  return (
    <div className={styles.containerContent}>
        {formIsOpen ? <AddClientForm closeForm={toggleForm}/> : ''}

        <div className={styles.header}>
            <input
                type="text"
                placeholder="Поиск по названию компании..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.addButton} onClick={() => toggleForm(true)}>Добавить</button>
        </div>

        <div className={styles.listContainer}>
            {clients
                .filter(client =>
                    client.company.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(client => (
                    <Link
                        key={client.id}
                        to={`/client/${client.id}`}
                        className={styles.clientBlock}
                    >
                        <div className={styles.clientHeader}>
                            <h3>{client.company}</h3>
                        </div>
                        <p>Менеджер: {client.manager}</p>
                        <p>Статус: {client.status}</p>
                    </Link>
                ))}
        </div>

    </div>
  );
}

export default ClientList;
