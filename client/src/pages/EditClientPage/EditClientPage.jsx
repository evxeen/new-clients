import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './EditClientPage.module.scss';

function EditClientPage() {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

    // Получение клиента
    useEffect(() => {
        fetch(`/api/clients/${id}`)
            .then(res => res.json())
            .then(data => {
                setClient(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Ошибка загрузки клиента:', err);
                setLoading(false);
            });
    }, [id]);

    // Обработчик изменений
    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient(prev => ({ ...prev, [name]: value }));
    };

    // Сохранить изменения
    const handleSave = () => {
        fetch(`/api/clients/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(client)
        })
            .then(res => res.json())
            .then(() => {
                alert('Клиент обновлён');
            })
            .catch(err => {
                console.error('Ошибка сохранения:', err);
            });
    };

    if (loading) return <p>Загрузка...</p>;
    if (!client) return <p>Клиент не найден</p>;

    return (
        <div className={styles.container}>
            <h2>Редактирование клиента: {client.company}</h2>

            <div className={styles.field}>
                <label>Компания:</label>
                <input name="company" value={client.company || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>ИНН:</label>
                <input name="code" value={client.code || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Регион:</label>
                <input name="region" value={client.region || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Город:</label>
                <input name="city" value={client.city || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Юридический адрес:</label>
                <input name="address" value={client.address || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Директор:</label>
                <input name="director" value={client.director || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Электронная почта:</label>
                <input name="email" value={client.email || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Телефон:</label>
                <input name="phone" value={client.phone || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Сайт компании:</label>
                <input name="site" value={client.site || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Полномочия:</label>
                <input name="authority" value={client.authority || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Менеджер:</label>
                <input name="manager" value={client.manager || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Потребность:</label>
                <input name="requirement" value={client.requirement || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Заявленный объем:</label>
                <input name="volume" value={client.volume || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Поставщики:</label>
                <input name="suppliers" value={client.suppliers || ''} onChange={handleChange}/>
            </div>

            <button onClick={handleSave}>Сохранить</button>
        </div>
    );
}

export default EditClientPage;
