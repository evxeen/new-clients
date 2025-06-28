import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AddClientForm from '../AddClientForm/AddClientForm';

function ClientList() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error('Ошибка загрузки клиентов:', err));
  }, [clients]);

  return (
    <div>
      <AddClientForm />
      <h1>Список клиентов</h1>
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
