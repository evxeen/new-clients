import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [note, setNote] = useState('');

  // Получение клиента
  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c) => c.id === Number(id));
        setClient(found);
      })
      .catch((err) => console.error('Ошибка загрузки клиента:', err));
  }, [id]);

  // Добавление записи в историю
  const handleAddNote = async () => {
    if (!note.trim()) return;

    const res = await fetch(`/api/clients/${id}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });

    if (res.ok) {
      const data = await res.json();
      setClient({ ...client, history: data.history });
      setNote('');
    } else {
      console.error('Ошибка при добавлении записи');
    }
  };

  if (!client) return <div>Клиент не найден</div>;

  return (
    <div>
      <Link to="/">← Назад</Link>
      <h2>{client.company}</h2>
      <p><strong>Менеджер:</strong> {client.manager}</p>
      <p><strong>Статус:</strong> {client.status}</p>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Телефон:</strong> {client.phone}</p>
      <p><strong>Представитель:</strong> {client.representative}</p>

      <h3>История:</h3>
      {client.history?.length > 0 ? (
        <ul>
          {client.history.map((entry, index) => (
            <li key={index}>
              <strong>{entry.date}:</strong> {entry.note}
            </li>
          ))}
        </ul>
      ) : (
        <p>История пока пуста</p>
      )}

      <div style={{ marginTop: '1em' }}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Добавьте заметку..."
          style={{ width: '100%', padding: '8px' }}
        />
        <button onClick={handleAddNote} style={{ marginTop: '0.5em' }}>
          Добавить запись
        </button>
      </div>
    </div>
  );
}

export default ClientDetail;
