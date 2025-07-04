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
      .then((data) => setClients(data))
      .catch((err) => console.error('Ошибка загрузки клиентов:', err));
  }, []);

  const toggleForm = (isOpen) => {
      setFormIsOpen(isOpen)
  }

  return (
    <div>
        {formIsOpen ? <AddClientForm closeForm={toggleForm}/> : ''}

        <div className={styles.header}>
            <button className={styles.addButton} onClick={() => toggleForm(true)}>Добавить</button>
        </div>
        {clients.map((client) => (
        <div key={client.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{client.company}</h3>
          <p>Менеджер: {client.manager}</p>
          <p>Статус: {client.status}</p>
          <Link to={`/client/${client.id}`}>Подробнее</Link>
        </div>
      ))}
    </div>
  );
}

export default ClientList;
