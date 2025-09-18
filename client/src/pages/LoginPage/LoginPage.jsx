import { useState } from 'react';
import api from '../../api.js';

export default function LoginPage({ onLogin }) {
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false); // <-- состояние для показа пароля

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await api.post('/api/auth/login', { number, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            onLogin(user, token);
        } catch (err) {
            setError('Неверные данные для входа');
        }
    };

    return (
        <div className="flex h-screen justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">Вход</h2>
                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="text"
                    placeholder="Табельный номер"
                    className="border p-2 w-full mb-2"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />

                <div className="relative mb-2">
                    <input
                        type={showPassword ? "text" : "password"} // <-- меняем тип
                        placeholder="Пароль"
                        className="border p-2 w-full pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? 'Скрыть' : 'Показать'}
                    </button>
                </div>

                <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
                    Войти
                </button>
            </form>
        </div>
    );
}
