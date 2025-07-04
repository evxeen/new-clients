import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientDetail from './components/ClientDetail/ClientDetail';
import ClientList from "./pages/ClientList/ClientList.jsx";
import styles from './App.module.scss'

function App() {
  return (
      <div className={styles.container}>
          <Router>
              <Routes>
                  <Route path="/" element={<ClientList />} />
                  <Route path="/client/:id" element={<ClientDetail />} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
