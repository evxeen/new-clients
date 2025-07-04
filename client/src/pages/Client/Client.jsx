// import { Outlet, Link, useParams } from 'react-router-dom';
// import styles from './ClientPage.module.scss';
//
// function ClientPage() {
//     const { id } = useParams();
//
//     return (
//         <div className={styles.wrapper}>
//             <nav className={styles.nav}>
//                 <Link to={`/client/${id}`}>Главная</Link>
//                 <Link to={`/client/${id}/history`}>История</Link>
//                 <Link to={`/client/${id}/contacts`}>Контакты</Link>
//             </nav>
//
//             <div className={styles.content}>
//                 <Outlet />
//             </div>
//         </div>
//     );
// }
//
// export default ClientPage;
//
//
// // import React, { useEffect, useState } from 'react';
// // import { useParams, Link, useNavigate } from 'react-router-dom';
// //
// // function Client() {
// //     const { id } = useParams();
// //     const navigate = useNavigate();
// //     const [client, setClient] = useState(null);
// //     const [note, setNote] = useState('');
// //     const [editedClient, setEditedClient] = useState(null);
// //
// //
// //     useEffect(() => {
// //         fetch('/api/clients')
// //             .then((res) => res.json())
// //             .then((data) => {
// //                 const found = data.find((c) => c.id === Number(id));
// //                 setClient(found);
// //                 setEditedClient(found); // Создаём копию для редактирования
// //             })
// //             .catch((err) => console.error('Ошибка загрузки клиента:', err));
// //     }, [id]);
// //
// //     const handleAddNote = async () => {
// //         if (!note.trim()) return;
// //         const res = await fetch(`/api/clients/${id}/history`, {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ note }),
// //         });
// //
// //         if (res.ok) {
// //             const data = await res.json();
// //             setClient({ ...client, history: data.history });
// //             setNote('');
// //         }
// //     };
// //
// //     const handleChange = (field, value) => {
// //         setEditedClient((prev) => ({ ...prev, [field]: value }));
// //     };
// //
// //     const handleSave = async () => {
// //         const res = await fetch(`/api/clients/${id}`, {
// //             method: 'PUT',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify(editedClient),
// //         });
// //
// //         if (res.ok) {
// //             const data = await res.json();
// //             setClient(data);
// //             alert('Клиент обновлён');
// //         } else {
// //             alert('Ошибка при сохранении');
// //         }
// //     };
// //
// //     const handleDelete = async () => {
// //         const confirmed = window.confirm('Вы уверены, что хотите удалить этого клиента?');
// //         if (!confirmed) return;
// //
// //         try {
// //             const res = await fetch(`/api/clients/${id}`, {
// //                 method: 'DELETE',
// //             });
// //
// //             if (res.ok) {
// //                 alert('Клиент удалён');
// //                 navigate('/'); // перенаправляем на главную
// //             } else {
// //                 alert('Ошибка при удалении');
// //             }
// //         } catch (err) {
// //             console.error('Ошибка при удалении клиента:', err);
// //         }
// //     };
// //
// //     if (!editedClient) return <div>Клиент не найден</div>;
// //
// //     return (
// //         <div>
// //             <Link to="/">← Назад</Link>
// //             <h2>
// //                 <input
// //                     value={editedClient.company}
// //                     onChange={(e) => handleChange('company', e.target.value)}
// //                 />
// //             </h2>
// //
// //             <p>
// //                 <strong>Менеджер:</strong>
// //                 <input
// //                     value={editedClient.manager}
// //                     onChange={(e) => handleChange('manager', e.target.value)}
// //                 />
// //             </p>
// //             <p>
// //                 <strong>Статус:</strong>
// //                 <select
// //                     value={editedClient.status}
// //                     onChange={(e) => handleChange('status', e.target.value)}
// //                 >
// //                     <option value="Статус 1">Статус 1</option>
// //                     <option value="Статус 2">Статус 2</option>
// //                     <option value="Статус 3">Статус 3</option>
// //                     <option value="Статус 4">Статус 4</option>
// //                     <option value="Статус 5">Статус 5</option>
// //                 </select>
// //             </p>
// //             <p>
// //                 <strong>Email:</strong>
// //                 <input value={editedClient.email} onChange={(e) => handleChange('email', e.target.value)}/>
// //             </p>
// //             <p>
// //                 <strong>Телефон:</strong>
// //                 <input value={editedClient.phone} onChange={(e) => handleChange('phone', e.target.value)}/>
// //             </p>
// //             <p>
// //                 <strong>Представитель:</strong>
// //                 <input
// //                     value={editedClient.representative}
// //                     onChange={(e) => handleChange('representative', e.target.value)}
// //                 />
// //             </p>
// //
// //             <button onClick={handleSave}>💾 Сохранить</button>
// //
// //             <h3>История:</h3>
// //             {client.history?.length > 0 ? (
// //                 <ul>
// //                     {client.history.map((entry, index) => (
// //                         <li key={index}>
// //                             <strong>{entry.date}:</strong> {entry.note}
// //                         </li>
// //                     ))}
// //                 </ul>
// //             ) : (
// //                 <p>История пока пуста</p>
// //             )}
// //
// //             <div style={{marginTop: '1em'}}>
// //         <textarea
// //             value={note}
// //             onChange={(e) => setNote(e.target.value)}
// //             rows={3}
// //             placeholder="Добавьте заметку..."
// //             style={{width: '100%', padding: '8px'}}
// //         />
// //                 <button onClick={handleAddNote} style={{marginTop: '0.5em'}}>
// //                     Добавить запись
// //                 </button>
// //             </div>
// //
// //             <button style={{marginTop: '20px', color: 'white', background: 'red', padding: '8px 16px'}}
// //                     onClick={handleDelete}>
// //                 Удалить клиента
// //             </button>
// //         </div>
// //     );
// // }
// //
// // export default Client;
