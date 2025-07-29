import React, { useState } from 'react';
import styles from './AddClientForm.module.scss';
import regionsData from '../../constants/regions.json';

function AddClientForm({ closeForm }) {
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
            // onAdd(data);

            // Очистка формы
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

            closeForm(false);
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

                    {/*<select value={activity} onChange={e => setActivity(e.target.value)}>*/}
                    {/*    <option value="" disabled selected>Область деятельности</option>*/}
                    {/*    <option value="конечный потребитель">конечный потребитель</option>*/}
                    {/*    <option value="оптовая торговля">оптовая торговля</option>*/}
                    {/*    <option value="розничная торговля">розничная торговля</option>*/}
                    {/*    <option value="дистрибьюто">дистрибьютор</option>*/}
                    {/*    <option value="строительный магазин">строительный магазин</option>*/}
                    {/*    <option value="строительная организация">строительная организация</option>*/}
                    {/*</select>*/}

                    {/*<div className={styles.checkboxGroup}>*/}
                    {/*{productOptions.map(option => (*/}
                    {/*        <label key={option}>*/}
                    {/*            <input*/}
                    {/*                type="checkbox"*/}
                    {/*                value={option}*/}
                    {/*                checked={requirement.includes(option)}*/}
                    {/*                onChange={(e) => {*/}
                    {/*                    if (e.target.checked) {*/}
                    {/*                        setRequirement([...requirement, option]);*/}
                    {/*                    } else {*/}
                    {/*                        setRequirement(requirement.filter(item => item !== option));*/}
                    {/*                    }*/}
                    {/*                }}*/}
                    {/*            />*/}
                    {/*            {option}*/}
                    {/*        </label>*/}
                    {/*    ))}*/}
                    {/*</div>*/}

                    {/*<input placeholder="Заявленный объем (в месяц)" value={volume}*/}
                    {/*       onChange={e => setVolume(e.target.value)}/>*/}
                    {/*<input placeholder="ИНН" value={code} onChange={e => setCode(e.target.value)}/>*/}

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

                    {/*<input placeholder="Сайт компании" value={site} onChange={e => setSite(e.target.value)}/>*/}
                    {/*<input placeholder="Электронная почта компании" value={email}*/}
                    {/*       onChange={e => setEmail(e.target.value)}/>*/}
                    {/*<input placeholder="Номер телефона компании" value={phone}*/}
                    {/*       onChange={e => setPhone(e.target.value)}/>*/}
                    {/*<input placeholder="Директор компании" value={director}*/}
                    {/*       onChange={e => setDirector(e.target.value)}/>*/}
                    {/*<input placeholder="Основание полномочий" value={authority}*/}
                    {/*       onChange={e => setAuthority(e.target.value)}/>*/}
                    {/*<select value={manager} onChange={e => setManager(e.target.value)}>*/}
                    {/*    <option value="" disabled selected>Менеджер</option>*/}
                    {/*    <option value="Иван Иванов">Иван Иванов</option>*/}
                    {/*    <option value="Михаил Петров">Михаил Петров</option>*/}
                    {/*    <option value="Мария Лелина">Мария Лелина</option>*/}
                    {/*</select>*/}

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
