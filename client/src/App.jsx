import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientList from './components/ClientList/ClientList';
import ClientDetail from './components/ClientDetail/ClientDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientList />} />
        <Route path="/client/:id" element={<ClientDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
