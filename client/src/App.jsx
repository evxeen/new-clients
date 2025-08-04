import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.scss'
import ClientDetail from './components/ClientDetail/ClientDetail';
import ClientList from "./pages/ClientList/ClientList.jsx";
import ClientContacts from "./pages/ClientContacts/ClientContacts.jsx";
import ClientMainInfo from "./pages/ClientMainInfo/ClientMainInfo.jsx";
import ClientHistory from "./pages/ClientHistory/ClientHistory.jsx";
import EditClientPage from "./pages/EditClientPage/EditClientPage.jsx";
import FunnelPage from "./pages/FunnelPage/FunnelPage.jsx";
import LeadsPage from "./pages/LeadsPage/LeadsPage.jsx";

function App() {
  return (
      <div className={ styles.container }>
          <Router>
              <Routes>
                  <Route path="/" element={<ClientList />} />
                  <Route path="/funnel" element={<FunnelPage />} />
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/client/:id" element={<ClientDetail />} >
                      <Route index element={<ClientMainInfo />} />
                      <Route path="history" element={<ClientHistory />} />
                      <Route path="contacts" element={<ClientContacts />} />
                      <Route path="edit" element={<EditClientPage />} />
                  </Route>
              </Routes>
          </Router>
      </div>
  );
}

export default App;
