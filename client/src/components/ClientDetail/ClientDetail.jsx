import {Link, NavLink, Outlet, useParams } from 'react-router-dom';
import styles from './ClientDetail.module.scss';
import {useEffect, useState} from "react";

function ClientDetail() {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClient() {
            try {
                const res = await fetch(`/api/clients/${id}`);
                const data = await res.json();
                setClient(data);
            } catch (error) {
                console.error('Ошибка загрузки клиента:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchClient();
    }, [id]);

    if (loading) return <p>Загрузка...</p>;
    if (!client) return <p>Клиент не найден</p>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <Link className={styles.backLink} to="/">Главная</Link>
                <h2>{client.company} ({client.country})</h2>
            </div>

            <nav className={styles.nav}>
                <NavLink to={`/client/${id}`} end
                         className={({isActive}) => isActive ? styles.active : ''}>Главная</NavLink>
                <NavLink to={`/client/${id}/history`}
                         className={({isActive}) => isActive ? styles.active : ''}>История</NavLink>
                <NavLink to={`/client/${id}/contacts`}
                         className={({isActive}) => isActive ? styles.active : ''}>Контакты</NavLink>
                <NavLink to={`/client/${id}/edit`}
                         className={({isActive}) => isActive ? styles.active : ''}>Редактирование</NavLink>
            </nav>

            <div className={styles.content}>
                <Outlet context={{client, setClient}}/>
            </div>
        </div>
    );
}

export default ClientDetail;