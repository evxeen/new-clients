import {useState,useEffect} from "react";
import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom';
import styles from './App.module.scss'
import api from './api.js'
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import ClientDetail from './components/ClientDetail/ClientDetail';
import ClientList from "./pages/ClientList/ClientList.jsx";
import ClientContacts from "./pages/ClientContacts/ClientContacts.jsx";
import ClientMainInfo from "./pages/ClientMainInfo/ClientMainInfo.jsx";
import ClientHistory from "./pages/ClientHistory/ClientHistory.jsx";
import EditClientPage from "./pages/EditClientPage/EditClientPage.jsx";
import FunnelPage from "./pages/FunnelPage/FunnelPage.jsx";
import LeadsPage from "./pages/LeadsPage/LeadsPage.jsx";

function App() {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        api.get("/api/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        window.location.href = "/";
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/";
    };

    if (loading) return <div>Загрузка...</div>;
    if (!user) return <LoginPage onLogin={handleLogin} />;

    return (
            <div className={styles.container}>

                <Router>
                    <Routes>
                        {/* login доступен всегда */}
                        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                        {/* защищённые маршруты */}
                        {user ? (
                            <>
                                < Route path="/" element={<ClientList user={user} onLogout={logout} />} />
                                < Route path="/funnel" element={
                                    user.role === "ADMIN" || user.role === "LEAD"
                                        ? <FunnelPage user={user} />
                                        : <Navigate to="/" />
                                } />
                                <Route path="/leads" element={
                                    user.role === "ADMIN" || user.role === "LEAD"
                                        ? <LeadsPage user={user} />
                                        : <Navigate to="/" />
                                } />
                                <Route path="/client/:id" element={<ClientDetail user={user} />}>
                                    <Route index element={<ClientMainInfo />} />
                                    <Route path="history" element={<ClientHistory />} />
                                    <Route path="contacts" element={<ClientContacts />} />
                                    <Route path="edit" element={<EditClientPage />} />
                                </Route>
                            </>
                        ) : (
                            // если не залогинен — редиректим на login
                            <Route path="*" element={<Navigate to="/login" />} />
                        )}
                    </Routes>
                </Router>

            </div>
    );
}

export default App;
