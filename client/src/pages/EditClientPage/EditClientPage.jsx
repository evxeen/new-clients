import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './EditClientPage.module.scss';
import AddContactForm from "../../components/AddContactForm/AddContactForm.jsx";

const productOptions = [
    "Гвозди", "Болты", "Саморезы", "Винты", "Гайки", "Шпильки",
     "Шурупы", "Заклепки", "Оси", "Шплинты", "Проволока"
];

function EditClientPage() {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [square, setSquare] = useState("");
    const [unit , setUnit ] = useState('м');
    const [plusIsShow, setPlusIsShow] = useState(false);
    const [inputIsShow, setInputIsShow] = useState(false);
    const [newRequirement, setNewRequirement] = useState('');
    const [salesValue, setSalesValue] = useState("");
    const [salesUnit, setSalesUnit] = useState("");
    const [newSupplier, setNewSupplier] = useState("");
    const [inputSupIsShow, setInputSupIsShow] = useState(false);

    useEffect(() => {
        fetch(`/api/clients/${id}`)
            .then(res => res.json())
            .then(data => {
                setClient({
                    ...data,
                    requirement: data.requirement || [],
                    activity: data.activity || "",
                    salesVolume: { value: "", unit: "" }
                });
                setSalesValue(data.salesVolume?.value || "");
                setSalesUnit(data.salesVolume?.unit || "");
                setLoading(false);
            })
            .catch(err => {
                console.error('Ошибка загрузки клиента:', err);
                setLoading(false);
            });

    }, [id]);

    const handleSalesValueChange = (e) => {
        const newValue = e.target.value;
        setSalesValue(newValue);
        setClient(prev => ({
            ...prev,
            salesVolume: { ...prev.salesVolume, value: newValue }
        }));
    };

    const handleSalesUnitChange = (e) => {
        const newUnit = e.target.value;
        setSalesUnit(newUnit);
        setClient(prev => ({
            ...prev,
            salesVolume: { ...prev.salesVolume, unit: newUnit }
        }));
    };

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

    const handleContactChange = (indexToSet) => {
        const update = client.contacts.map((contact, index) => ({
            ...contact,
            isMain: indexToSet === index
        }))

        setClient(prev => ({...prev, contacts: [...update]}));
    }

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

    const handleAddContact = (newContact) => {
        setClient(prev => ({...prev, contacts: [...client.contacts, newContact]}))
    };

    const addWarehouses = () => {
        let newWarehouse = {[square]: unit};
        setClient(prev => ({...prev, warehouses: [...client.warehouses, newWarehouse]}));
        setPlusIsShow(!plusIsShow);
    }

    const addNewRequirement = () => {
        productOptions.push(newRequirement);
        setInputIsShow(!inputIsShow);
        setNewRequirement('');
    }

    const addNewSupplier = () => {
        const newSup = {name: newSupplier, select: false};
        setClient(prev => ({...prev, suppliers: [...client.suppliers, newSup]}));
        setInputSupIsShow(false);
        setNewSupplier("");
    }

    const handleSuppliersChange = (indexToSet) => {
        setClient(prev => {
            const updatedSuppliers = prev.suppliers.map((sup, index) =>
                index === indexToSet ? { ...sup, select: !sup.select } : sup
            );
            return { ...prev, suppliers: updatedSuppliers };
        });
    };

    if (loading) return <p>Загрузка...</p>;
    if (!client) return <p>Клиент не найден</p>;

    return (
        <div className={styles.container}>
            {showModal ? <AddContactForm onSubmit={handleAddContact} onClose={setShowModal}/> : ''}
            <h2>Редактирование клиента: {client.company}</h2>

            <div className={styles.formGrid}>

                {/* Левая колонка */}
                <div className={styles.column}>
                    <div className={styles.field}>
                        <label>Компания:</label>
                        <input name="company" value={client.company || ''} onChange={handleChange}/>
                    </div>

                    <div className={styles.field}>
                        <label>Сфера деятельности:</label>
                        <select name="activity" value={client.activity} onChange={handleChange}>
                            <option value="" disabled>Выберите</option>
                            <option value="конечный потребитель">конечный потребитель</option>
                            <option value="оптовая торговля">оптовая торговля</option>
                            <option value="розничная торговля">розничная торговля</option>
                            <option value="дистрибьютор">дистрибьютор</option>
                            <option value="строительный магазин">строительный магазин</option>
                            <option value="строительная организация">строительная организация</option>
                            <option value="производитель">производитель</option>
                        </select>
                    </div>

                    <div className={styles.column}>
                        <div className={styles.field}>
                            <label>Страна/Регион/Город:</label>
                            <input name="country" value={client.country || ''} onChange={handleChange} placeholder='Страна'/>
                            <input name="region" value={client.region || ''} onChange={handleChange} placeholder='Регион'/>
                            <input name="city" value={client.city || ''} onChange={handleChange} placeholder='Город'/>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <div className={styles.field}>
                            <label>Штат сотрудников:</label>
                            <input name="staff" value={client.staff || ''} onChange={handleChange}/>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <div className={styles.field}>
                            <label>Заявленный объем(в месяц):</label>
                            <input name="volume" value={client.volume || ''} onChange={handleChange}/>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <div className={styles.field}>
                            <label>Наличие филиала:</label>
                            <div className={styles.responses}>
                                <span
                                    className={`${styles.productTag} ${client.branchAvailability === "Да" ? styles.selected : ''}`}
                                    onClick={(e) => setClient(prev => ({
                                        ...prev,
                                        branchAvailability: e.target.innerHTML
                                    }))}>Да</span>
                                <span
                                    className={`${styles.productTag} ${client.branchAvailability === "Нет" ? styles.selected : ''}`}
                                    onClick={(e) => setClient(prev => ({
                                        ...prev,
                                        branchAvailability: e.target.innerHTML
                                    }))}>Нет</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <div className={styles.field}>
                            <label>Наличие складов:</label>
                            {client.warehouses.map((item, index) => {
                                const [key, value] = Object.entries(item)[0]; // получаем первую пару ключ-значение
                                return (
                                    <span className={styles.productTag} key={index}>
                                        {key} {value}
                                    </span>
                                );
                            })}
                            {plusIsShow ?
                                <div>
                                    <input value={square} className={styles.inputWarehouses}
                                           onChange={(e) => setSquare(e.target.value)}/>
                                    <select className={styles.selectWarehouses}
                                            onChange={(e) => setUnit(e.target.value)}>
                                        <option value="" disabled>Выберите значение</option>
                                        <option value="м">Метры</option>
                                        <option value="т">Тонны</option>
                                    </select>
                                    <button onClick={addWarehouses}>✔</button>
                                </div>
                                :
                                <button onClick={() => setPlusIsShow(!plusIsShow)}>+</button>
                            }

                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Клиентская база:</label>
                        <input name="customers" value={client.customers || ''}
                               onChange={handleChange}/>
                    </div>

                    <div className={styles.field}>
                        <label>Потребность:</label>
                        <div className={styles.productList}>
                            {productOptions.map(option => (
                                <span
                                    key={option}
                                    className={`${styles.productTag} ${client.requirement.includes(option) ? styles.selected : ''}`}
                                    onClick={() => handleRequirementChange(option)}
                                >
                  {option}
                </span>
                            ))}
                            {inputIsShow ?
                                <div>
                                    <input className={styles.requirementInput} type="text" value={newRequirement}
                                           onChange={(e) => setNewRequirement(e.target.value)}/>
                                    <button onClick={addNewRequirement}>✔</button>
                                </div>
                                :
                                <button onClick={() => setInputIsShow(!inputIsShow)}>+</button>
                            }


                        </div>

                    </div>
                    <div className={styles.field}>
                        <label>Объём продаж:</label>
                        <input
                            type="text"
                            value={salesValue}
                            onChange={handleSalesValueChange}
                            className={styles.inputWarehouses}
                        />
                        <select
                            value={salesUnit}
                            onChange={handleSalesUnitChange}
                            className={styles.selectWarehouses}
                        >
                            <option value="" disabled>Выберите значение</option>
                            <option value="тонн">тонн</option>
                            <option value="рос. рублей">рос. рублей</option>
                        </select>
                    </div>

                    <div className={styles.column}>
                        <div className={styles.field}>
                            <label>Поставщики:</label>
                            <div className={styles.productList}>
                                {client.suppliers.map((el, index) => (
                                    <span
                                        key={index}
                                        className={`${styles.productTag} ${el.select ? styles.selected : ''}`}
                                        onClick={() => handleSuppliersChange(index)}
                                    >
                {el.name}
            </span>
                                ))}
                                {inputSupIsShow ? (
                                    <div>
                                        <input
                                            className={styles.requirementInput}
                                            type="text"
                                            value={newSupplier}
                                            onChange={(e) => setNewSupplier(e.target.value)}
                                        />
                                        <button onClick={addNewSupplier}>✔</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setInputSupIsShow(!inputSupIsShow)}>+</button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
                {/* Правая колонка */}

                <div className={styles.column}>

                    <div className={styles.column}>
                        <div className={styles.field}>
                            <label>Юридический адрес:</label>
                            <input name="address" value={client.address || ''} onChange={handleChange}/>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Сайт:</label>
                        <input name="site" value={client.site || ''} onChange={handleChange}/>
                    </div>

                    <div className={styles.field}>
                        <label>Email:</label>
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
                        <label>Контакты:</label>
                        <div className={styles.productList}>
                            {client.contacts.map((contact, index) => (
                                <span
                                    key={contact.name}
                                    className={`${styles.productTag} ${contact.isMain ? styles.selected : ''}`}
                                    onClick={() => handleContactChange(index)}
                                >
                                {contact.name}
                                </span>
                            ))}

                            <div
                                className={styles.addIcon}
                                onClick={() => setShowModal(true)}
                                title="Добавить контакт"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={styles.icon}
                                    viewBox="0 0 24 24"
                                >
                                    <g fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" d="M12 8v4m0 0v4m0-4h4m-4 0H8"/>
                                        <circle cx="12" cy="12" r="10"/>
                                    </g>
                                </svg>
                            </div>

                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>ИНН:</label>
                        <input name="code" value={client.code || ''} onChange={handleChange}/>
                    </div>

                    <div className={styles.field}>
                        <label>Основание полномочий:</label>
                        <select name="authority" value={client.authority || ''} onChange={handleChange}>
                            <option value="" disabled>Выберите</option>
                            <option value="на основании устава">на основании устава</option>
                            <option value="на основании доверенности">на основании доверенности</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Источник клиента:</label>
                        <select name="sourceLid" value={client.sourceLid || ''} onChange={handleChange}>
                            <option value="" disabled>Выберите</option>
                            <option value="Интернет-поиск (Google, Яндекс и др.)">Интернет-поиск (Google, Яндекс и
                                др.)
                            </option>
                            <option value="Рекомендации и сарафанное радио">Рекомендации и сарафанное радио</option>
                            <option value="Социальные сети (VK, Instagram, Facebook и др.)">Социальные сети (VK,
                                Instagram, Facebook и др.)
                            </option>
                            <option value="Выставка или ярмарка">Выставка или ярмарка</option>
                            <option value="Холодный звонок">Холодный звонок</option>
                            <option value="Email-рассылка">Email-рассылка</option>
                            <option value="Реклама в интернете (контекстная, баннерная и др.)">Реклама в интернете
                                (контекстная, баннерная и др.)
                            </option>
                            <option value="Реклама в СМИ (телевидение, радио, газеты)">Реклама в СМИ (телевидение,
                                радио, газеты)
                            </option>
                            <option value="Партнёрская программа">Партнёрская программа</option>
                            <option value="Обратился сам">Обратился сам</option>
                        </select>
                    </div>

                    <div className={`${styles.field} ${styles.manager}`}>
                        <label>Ответственный менеджер:</label>
                        <select name="manager" value={client.manager || ''} onChange={handleChange}>
                            <option value="" disabled>Выберите</option>
                            <option value="Капуза Виктор">Капуза Виктор</option>
                            <option value="Петоченко Светлана">Петоченко Светлана</option>
                            <option value="Кучерина Ольга">Кучерина Ольга</option>
                            <option value="Ковальчук Наталья">Ковальчук Наталья</option>
                            <option value="Кострома Наталья">Кострома Наталья</option>
                            <option value="Зайцева Татьяна">Зайцева Татьяна</option>
                            <option value="Тямчик Татьяна">Тямчик Татьяна</option>
                            <option value="Лобан Елена">Лобан Елена</option>
                            <option value="Кузьменок Татьяна">Лобан Елена</option>
                            <option value="Лысенко Евгений">Лысенко Евгений</option>
                        </select>
                    </div>

                </div>

            </div>

            <div className={styles.buttonSave} onClick={handleSave}>
                <p>
                    Сохранить
                </p>
            </div>
        </div>
    );
}

export default EditClientPage;
