import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home.js';
import Diseño from './Pages/Design/Design.js';
import Navbar from './components/Navbar/Navbar.js';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Diseño" element={<Diseño />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
