import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './AddClientForm.module.scss';

function AddClientForm({ closeForm, onClientAdded }) {
    const navigate = useNavigate();

    const [company, setCompany] = useState('');
    const [activity, setActivity] = useState('');
    const [requirement, setRequirement] = useState([]);
    const [volume, setVolume] = useState('');
    const [code, setCode] = useState('');
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [city, setCity] = useState('');
    const [site, setSite] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [director, setDirector] = useState('');
    const [authority, setAuthority] = useState('');
    const [manager, setManager] = useState('');

    // справочники
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);

    // загрузка стран
    useEffect(() => {
        fetch('/api/clients/countries')
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(err => console.error('Ошибка загрузки стран:', err));
    }, []);

    // загрузка регионов при выборе страны
    useEffect(() => {
        if (!country) return;
        fetch(`/api/clients/regions?countryId=${country}`)
            .then(res => res.json())
            .then(data => setRegions(data))
            .catch(err => console.error('Ошибка загрузки регионов:', err));
    }, [country]);

    useEffect(() => {
        if (!country) return;

        let url;
        if (region) {
            url = `/api/clients/cities?regionId=${region}`;
        } else {
            url = `/api/clients/cities?countryId=${country}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => setCities(data))
            .catch(err => console.error('Ошибка загрузки городов:', err));
    }, [country, region]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Находим объекты по выбранным ID
        const countryObj = countries.find(c => c.id === country);
        const regionObj = regions.find(r => r.id === region);
        const cityObj = cities.find(c => c.id === city);

        const newClient = {
            id: Math.floor(Math.random() * (2_000_000_000 - 1_000_000) + 1_000_000),
            company,
            activity,
            requirement,
            volume,
            code,
            country: countryObj?.name || '',
            region: regionObj?.name || '',
            city: cityObj?.name || '',
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

            if (onClientAdded) onClientAdded(data);
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
                    <input
                        placeholder="Название компании"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        required
                    />

                    <select value={country} onChange={e => setCountry(e.target.value)}>
                        <option value="" disabled>Выберите страну</option>
                        {countries.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    {country && (
                        <select value={region} onChange={e => setRegion(e.target.value)} >
                            {/*<option value="" disabled>Выберите регион</option>*/}
                            <option value="">Без региона</option>
                            {regions.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    )}

                    {country && (
                        <select value={city} onChange={e => setCity(e.target.value)} >
                            <option value="" disabled>Выберите город</option>
                            {cities.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
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
