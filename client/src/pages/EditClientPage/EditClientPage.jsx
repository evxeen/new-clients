import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './EditClientPage.module.scss';
import regionsData from '../../constants/regions.json';

const productOptions = [
    "Гвозди", "Болты", "Винты", "Гайки", "Шпильки",
    "Саморезы", "Шурупы", "Заклепки", "Оси", "Шплинты", "Проволока", "др."
];

function EditClientPage() {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

    const uniqueRegions = [...new Set(regionsData.map(item => item.region))];

    const filteredCities = regionsData
        .filter(item => item.region === client?.region)
        .map(item => item.city);

    // Получение клиента
    useEffect(() => {
        fetch(`/api/clients/${id}`)
            .then(res => res.json())
            .then(data => {
                setClient({
                    ...data,
                    requirement: data.requirement || [],
                    activity: data.activity || "",
                });
                setLoading(false);
            })
            .catch(err => {
                console.error('Ошибка загрузки клиента:', err);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setClient(prev => {
            if (name === "region") {
                return { ...prev, region: value, city: "" };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleRequirementChange = (option) => {
        setClient(prev => {
            const newReq = prev.requirement.includes(option)
                ? prev.requirement.filter(item => item !== option)
                : [...prev.requirement, option];
            return { ...prev, requirement: newReq };
        });
    };

    const handleSave = () => {
        fetch(`/api/clients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
        })
            .then(res => res.json())
            .then(() => alert('Клиент обновлён'))
            .catch(err => console.error('Ошибка сохранения:', err));
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
                <label>Область деятельности:</label>
                <select
                    name="activity"
                    value={client.activity}
                    onChange={handleChange}
                >
                    <option value="" disabled>Выберите</option>
                    <option value="конечный потребитель">конечный потребитель</option>
                    <option value="оптовая торговля">оптовая торговля</option>
                    <option value="розничная торговля">розничная торговля</option>
                    <option value="дистрибьютор">дистрибьютор</option>
                    <option value="строительный магазин">строительный магазин</option>
                    <option value="строительная организация">строительная организация</option>
                </select>
            </div>

            <div className={styles.field}>
                <label>Потребность:</label>
                <div className={styles.productList}>
                    {productOptions.map(option => (
                        <label key={option} className={styles.checkboxItem}>
                            <input
                                type="checkbox"
                                checked={client.requirement.includes(option)}
                                onChange={() => handleRequirementChange(option)}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className={styles.field}>
                <label>Сайт компании:</label>
                <input name="site" value={client.site || ''} onChange={handleChange}/>
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
                <label>Директор:</label>
                <input name="director" value={client.director || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Основание полномочий:</label>
                <select name="authority" value={client.authority} onChange={handleChange}>
                    <option value="" disabled>Выберите</option>
                    <option value="на основании устава">на основании устава</option>
                    <option value="на основании доверенности">на основании доверенности</option>
                </select>
            </div>

            <div className={styles.field}>
                <label>Менеджер:</label>
                <select name="manager" value={client.manager} onChange={handleChange}>
                    <option value="" disabled>Выберите</option>
                    <option value="Менеджер 1">Менеджер 1</option>
                    <option value="Менеджер 2">Менеджер 2</option>
                    <option value="Менеджер 3">Менеджер 3</option>
                </select>
            </div>

            <div className={styles.field}>
            <label>Заявленный объем (в месяц):</label>
                <select name="volume" value={client.volume} onChange={handleChange}>
                    <option value="" disabled>Выберите</option>
                    <option value="5">до 5 тонн</option>
                    <option value="10">до 10 тонн</option>
                    <option value="15 5">до 15 тонн</option>
                    <option value="20">до 20 тонн</option>
                    <option value="25">до 25 тонн</option>
                    <option value="30">до 30 тонн</option>
                    <option value="35">до 35 тонн</option>
                    <option value="40">до 40 тонн</option>
                    <option value="45">до 45 тонн</option>
                </select>
            </div>

            <div className={styles.field}>
                <label>ИНН:</label>
                <input name="code" value={client.code || ''} onChange={handleChange}/>
            </div>

            <div className={styles.field}>
                <label>Регион:</label>
                <select name="region" value={client.region || ''} onChange={handleChange} required>
                    <option value="" disabled>Выберите регион</option>
                    {uniqueRegions.map((reg, index) => (
                        <option key={index} value={reg}>{reg}</option>
                    ))}
                </select>
            </div>

            {client.region && (
                <div className={styles.field}>
                    <label>Город:</label>
                    <select name="city" value={client.city || ''} onChange={handleChange} required>
                        <option value="" disabled>Выберите город</option>
                        {filteredCities.map((c, index) => (
                            <option key={index} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            )}


            <div className={styles.field}>
                <label>Юридический адрес:</label>
                <input name="address" value={client.address || ''} onChange={handleChange}/>
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
