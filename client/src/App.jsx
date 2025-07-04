import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientDetail from './components/ClientDetail/ClientDetail';
import ClientList from "./pages/ClientList/ClientList.jsx";
import styles from './App.module.scss'
import ClientContacts from "./pages/ClientContacts/ClientContacts.jsx";
import ClientMainInfo from "./pages/ClientMainInfo/ClientMainInfo.jsx";
import ClientHistory from "./pages/ClientHistory/ClientHistory.jsx";

function App() {
  return (
      <div className={styles.container}>
          <Router>
              <Routes>
                  <Route path="/" element={<ClientList />} />
                  <Route path="/client/:id" element={<ClientDetail />} >
                      <Route index element={<ClientMainInfo />} />
                      <Route path="history" element={<ClientHistory />} />
                      <Route path="contacts" element={<ClientContacts />} />
                  </Route>
              </Routes>
          </Router>
      </div>
  );
}

export default App;
