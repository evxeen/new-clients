import React, { useState } from 'react';
import styles from './AddClientForm.module.scss';

function AddClientForm({ closeForm }) {
    const [company, setCompany] = useState('');
    const [activity, setActivity] = useState('');
    const [requirement, setRequirement] = useState([]);
    const [volume, setVolume] = useState('');
    const [code, setCode] = useState('');
    const [address, setAddress] = useState('');
    const [site, setSite] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [director, setDirector] = useState('');
    const [authority, setAuthority] = useState('');
    const [manager, setManager] = useState('');

    const productOptions = [
        "Гвозди", "Болты", "Винты", "Гайки", "Шпильки",
        "Саморезы", "Шурупы", "Заклепки", "Оси", "Шплинты", "Проволока"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newClient = {
            id: Date.now(),
            company,
            activity,
            requirement,
            volume,
            code,
            address,
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
            setAddress('');
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
                    <input placeholder="Область деятельности" value={activity}
                           onChange={e => setActivity(e.target.value)}/>

                    <div className={styles.checkboxGroup}>
                        {productOptions.map(option => (
                            <label key={option}>
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={requirement.includes(option)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setRequirement([...requirement, option]);
                                        } else {
                                            setRequirement(requirement.filter(item => item !== option));
                                        }
                                    }}
                                />
                                {option}
                            </label>
                        ))}
                    </div>

                    <input placeholder="Заявленный объем" value={volume} onChange={e => setVolume(e.target.value)}/>
                    <input placeholder="ИНН" value={code} onChange={e => setCode(e.target.value)}/>
                    <input placeholder="Юридический адрес" value={address} onChange={e => setAddress(e.target.value)}/>
                    <input placeholder="Сайт компании" value={site} onChange={e => setSite(e.target.value)}/>
                    <input placeholder="Электронная почта компании" value={email}
                           onChange={e => setEmail(e.target.value)}/>
                    <input placeholder="Номер телефона компании" value={phone}
                           onChange={e => setPhone(e.target.value)}/>
                    <input placeholder="Директор компании" value={director}
                           onChange={e => setDirector(e.target.value)}/>
                    <input placeholder="Основание полномочий" value={authority}
                           onChange={e => setAuthority(e.target.value)}/>
                    <select value={manager} onChange={e => setManager(e.target.value) }>
                        <option value="" disabled selected>Выберите вариант</option>
                        <option value="Иван Иванов">Иван Иванов</option>
                        <option value="Михаил Петров">Михаил Петров</option>
                        <option value="Мария Лелина">Мария Лелина</option>
                    </select>

                    <div className={styles.buttons}>
                    <button type="submit" >Добавить</button>
                        <button type="button" onClick={() => closeForm(false)}>Отменить</button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default AddClientForm;
