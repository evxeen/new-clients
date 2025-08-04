import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import styles from './AddClientForm.module.scss';
import regionsData from '../../constants/regions.json';

function AddClientForm({ closeForm, onClientAdded  }) {
    const navigate = useNavigate();
    const [company, setCompany] = useState('');
    const [activity, setActivity] = useState('');
    const [requirement, setRequirement] = useState([]);
    const [volume, setVolume] = useState('');
    const [code, setCode] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    const [site, setSite] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [director, setDirector] = useState('');
    const [authority, setAuthority] = useState('');
    const [manager, setManager] = useState('');

    const productOptions = [
        "Гвозди", "Болты", "Винты", "Гайки", "Шпильки",
        "Саморезы", "Шурупы", "Заклепки", "Оси", "Шплинты", "Проволока", "др."
    ];

    const uniqueRegions = [...new Set(regionsData.map(item => item.region))];

    const filteredCities = regionsData
        .filter(item => item.region === region)
        .map(item => item.city);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newClient = {
            id: Math.floor(Math.random() * (2_000_000_000 - 1_000_000) + 1_000_000),
            company,
            region,
            city,
            activity,
            requirement,
            volume,
            code,
            site,
            email,
            phone,
            director,
            authority,
            manager,
            history: []
        };

        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient),
            });
            const data = await res.json();

            // обновляем список в ClientList
            if (onClientAdded) onClientAdded(data);

            // очищаем форму
            setCompany('');
            setActivity('');
            setRequirement([]);
            setVolume('');
            setCode('');
            setSite('');
            setEmail('');
            setPhone('');
            setDirector('');
            setAuthority('');
            setManager('');
            setRegion('');
            setCity('');

            closeForm(false);
            navigate(`/client/${data.id}/edit`);
        } catch (err) {
            console.error('Ошибка добавления клиента:', err);
        }
    };

    return (
        <div className={styles.overlay}>
            <form className={styles.addForm} onSubmit={handleSubmit}>
                <div className={styles.fieldsBlock}>
                    <input placeholder="Название компании" value={company} onChange={e => setCompany(e.target.value)}
                           required/>

                    <select value={region} onChange={e => {
                        setRegion(e.target.value);
                    }} required>
                        <option value="" disabled>Выберите регион</option>
                        {uniqueRegions.map((reg, index) => (
                            <option key={index} value={reg}>{reg}</option>
                        ))}
                    </select>

                    {region && (
                        <select value={city} onChange={e => setCity(e.target.value)} required>
                            <option value="" disabled>Выберите город</option>
                            {filteredCities.map((c, index) => (
                                <option key={index} value={c}>{c}</option>
                            ))}
                        </select>
                    )}

                    <div className={styles.buttons}>
                        <button type="submit">Добавить</button>
                        <button type="button" onClick={() => closeForm(false)}>Отменить</button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default AddClientForm;
