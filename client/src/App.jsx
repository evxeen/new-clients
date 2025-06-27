import React, { useEffect, useState } from 'react';
import styles from './App.module.scss'
import ClientCard from './components/ClientCart/ClientCard.jsx';
import AddClientForm from "./components/AddClientForm/AddClientForm.jsx";

function App() {
    const [clients, setClients] = useState([]);
    useEffect(() => {
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(err => console.error('Ошибка загрузки клиентов:', err));
    }, []);
    //
    return (
        <div className={styles.container}>
            <h1>Список клиентов</h1>
            <AddClientForm onAdd={(newClient) => setClients(prev => [...prev, newClient])} />

            <div className={styles.clientList}>
                {clients.map(client => (
                    <ClientCard key={client.id} client={client} />
                ))}
            </div>
        </div>
    );
}

export default App;
