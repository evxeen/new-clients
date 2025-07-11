import React, {useState} from 'react';
import styles from './AddContactFrom.module.scss';

function AddContactForm({ onClose, onSubmit }) {
    const [newContact, setNewContact] = useState({
        name: '',
        lastName: '',
        post: '',
        phone: '',
        email: ''
    });

    const handleSubmit = () => {
        onSubmit(newContact);
        onClose(false); // Закрываем форму после добавления
    };

    return (
        <div className={styles.overlay}>
            {/*<button className={styles.closeBtn} onClick={onClose}>×</button>*/}
            <div className={styles.newContactForm}>
                <h4>Добавить контакт</h4>
                <input
                    type="text"
                    placeholder="Имя"
                    value={newContact.name}
                    onChange={e => setNewContact({...newContact, name: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Фамилия"
                    value={newContact.lastName}
                    onChange={e => setNewContact({...newContact, lastName: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Должность"
                    value={newContact.post}
                    onChange={e => setNewContact({...newContact, post: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Телефон"
                    value={newContact.phone}
                    onChange={e => setNewContact({...newContact, phone: e.target.value})}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newContact.email}
                    onChange={e => setNewContact({...newContact, email: e.target.value})}
                />
                <div className={styles.buttons}>
                    <button onClick={handleSubmit}>Добавить контакт</button>
                    <button type='button' onClick={() => onClose(false)}>Отменить</button>
                </div>

            </div>
        </div>
    );
}

export default AddContactForm;
