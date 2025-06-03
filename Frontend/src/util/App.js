import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home/Home.js';
import Productos from '../Pages/Products/Products.js';
import Diseño from '../Pages/Design/Design.js';
import Navbar from '../components/Navbar/Navbar.js';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/Diseño" element={<Diseño />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
