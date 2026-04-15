import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from "./pages/Menu";
import Header from './Layout/Header'
import Reservation from './pages/Reservation'
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path='/' element={<Menu />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservation" element={<Reservation />} />
      </Routes>
  </Router>
  );
}
export default App;
