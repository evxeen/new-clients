import React from 'react';

const ClientCard = ({ client }) => {
    return (
        <div className="client-card" style={styles.card}>
            <h3>{client.company}</h3>
            <p><strong>Менеджер:</strong> {client.manager}</p>
            <p><strong>Статус:</strong> {client.status}</p>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #ccc',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '8px',
        width: '300px',
        backgroundColor: '#fff',
    },
};

export default ClientCard;
