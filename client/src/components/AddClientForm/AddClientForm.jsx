import React, { useState } from 'react';

function AddClientForm({ onAdd }) {
    const [company, setCompany] = useState('');
    const [manager, setManager] = useState('');
    const [status, setStatus] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [representative, setRepresentative] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newClient = {
            id: Date.now(),
            company,
            manager,
            status,
            email,
            phone,
            representative,
            history: []
        };

        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient),
            });
            const data = await res.json();
            onAdd(data);

            // Очистка формы
            setCompany('');
            setManager('');
            setStatus('');
            setEmail('');
            setPhone('');
            setRepresentative('');
        } catch (err) {
            console.error('Ошибка добавления клиента:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Фирма" value={company} onChange={e => setCompany(e.target.value)} required />
            <input placeholder="Менеджер" value={manager} onChange={e => setManager(e.target.value)} />
            <input placeholder="Статус" value={status} onChange={e => setStatus(e.target.value)} />
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="Телефон" value={phone} onChange={e => setPhone(e.target.value)} />
            <input placeholder="Представитель" value={representative} onChange={e => setRepresentative(e.target.value)} />
            <button type="submit">Добавить клиента</button>
        </form>
    );
}

export default AddClientForm;
