import React, { useEffect, useState } from 'react';
import {data, Link} from 'react-router-dom';
import styles from './ClientList.module.scss'
import AddClientForm from "../../components/AddClientForm/AddClientForm.jsx";

function ClientList() {
  const [clients, setClients] = useState([]);
  const [formIsOpen, setFormIsOpen] = useState(false);

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
            <button className={styles.addButton} onClick={() => toggleForm(true)}>Добавить</button>
        </div>

        <div className={styles.listContainer}>
            {clients.map((client) => (
                <div key={client.id} className={styles.clientBlock}>
                    <div className={styles.clientHeader}>
                        <h3>{client.company}</h3>
                    </div>
                    <p>Менеджер: {client.manager}</p>
                    <p>Статус: {client.status}</p>
                    {/*<Link to={`/client/${client.id}`}>Подробнее</Link>*/}
                </div>
            ))}
        </div>

    </div>
  );
}

export default ClientList;
