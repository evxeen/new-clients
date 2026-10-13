
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './AddClientForm.module.scss';

function AddClientForm({ closeForm, onClientAdded, existingClients = [] }) {
    const navigate = useNavigate();

    const [company, setCompany] = useState('');
    const [companyError, setCompanyError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
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

    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);

    const blurTimeoutRef = useRef(null);
    const suggestionRef = useRef(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('Токен отсутствует, пользователь не авторизован');
                    return;
                }

                const res = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`Ошибка HTTP: ${res.status}`);
                }

                const user = await res.json();
                setManager(user.name);
                console.log(user.name)
            } catch (err) {
                console.error('Не удалось получить профиль:', err.message);
            }
        };

        fetchUserProfile();
    }, []);

    // Загрузка справочников
    useEffect(() => {
        fetch('/api/clients/countries')
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(err => console.error('Ошибка загрузки стран:', err));
    }, []);

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

    // Нормализация названия компании для сравнения
    const normalizeCompany = (name) => {
        return name.trim().toLowerCase().replace(/\s+/g, ' ');
    };

    // Проверка дубликата по existingClients
    const checkDuplicate = useCallback((companyName) => {
        if (!companyName.trim()) {
            setCompanyError('');
            return false;
        }

        const normalized = normalizeCompany(companyName);
        const exists = existingClients.some(client =>
            normalizeCompany(client.company) === normalized
        );

        if (exists) {
            setCompanyError('Клиент с таким названием уже существует');
            return true;
        } else {
            setCompanyError('');
            return false;
        }
    }, [existingClients]);

    // Фильтрация подсказок при вводе
    useEffect(() => {
        if (company.trim().length === 0) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const lowerQuery = company.toLowerCase();
        const filtered = existingClients
            .map(client => client.company)
            .filter(name => name.toLowerCase().includes(lowerQuery))
            .slice(0, 10); // ограничим количество

        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
    }, [company, existingClients]);

    // Обработчик выбора подсказки
    const handleSuggestionClick = (suggestion) => {
        setCompany(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        checkDuplicate(suggestion); // проверим дубликат
    };

    // Обработчик потери фокуса с задержкой, чтобы успеть кликнуть по подсказке
    const handleCompanyBlur = () => {
        blurTimeoutRef.current = setTimeout(() => {
            setShowSuggestions(false);
            checkDuplicate(company);
        }, 200);
    };

    // Обработчик фокуса (если нужно снова показать подсказки)
    const handleCompanyFocus = () => {
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }
        if (company.trim().length > 0 && suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    // Очистка таймера при размонтировании
    useEffect(() => {
        return () => {
            if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const countryObj = countries.find(c => c.id === country);
        const regionObj = regions.find(r => r.id === region);
        const cityObj = cities.find(c => c.id === city);

        // Формируем клиента без managerId — сервер его подставит
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
            history: [],
            manager: manager
        };

        try {
            const token = localStorage.getItem('token'); // берём токен из localStorage


            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // токен для authMiddleware
                },
                body: JSON.stringify(newClient),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Ошибка добавления клиента');
            }

            const data = await res.json();

            if (onClientAdded) onClientAdded(data);
            closeForm(false);
            navigate(`/client/${data.id}/edit`);
        } catch (err) {
            console.error('Ошибка добавления клиента:', err);
            alert(err.message); // чтобы увидеть на фронте
        }

    };

    return (
        <div className={styles.overlay}>
            <form className={styles.addForm} onSubmit={handleSubmit}>
                <div className={styles.fieldsBlock}>
                    <div className={styles.companyField} ref={suggestionRef}>
                        <input
                            placeholder="Название компании"
                            value={company}
                            onChange={e => setCompany(e.target.value)}
                            onFocus={handleCompanyFocus}
                            onBlur={handleCompanyBlur}
                            required
                            className={companyError ? styles.errorInput : ''}
                            autoComplete="off"
                        />
                        {companyError && <span className={styles.errorMessage}>{companyError}</span>}
                        {showSuggestions && (
                            <ul className={styles.suggestionsList}>
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // предотвращает потерю фокуса
                                            handleSuggestionClick(suggestion);
                                        }}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <select value={country} onChange={e => setCountry(e.target.value)} required>
                        <option value="" disabled>Выберите страну</option>
                        {countries.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    {country && (
                        <select value={region} onChange={e => setRegion(e.target.value)}>
                            <option value="">Без региона</option>
                            {regions.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    )}

                    {country && (
                        <select value={city} onChange={e => setCity(e.target.value)} required>
                            <option value="" disabled>Выберите город</option>
                            {cities.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    )}

                    <div className={styles.buttons}>
                        <button type="submit" disabled={!!companyError}>
                            Добавить
                        </button>
                        <button type="button" onClick={() => closeForm(false)}>Отменить</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddClientForm;