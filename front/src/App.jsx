// App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Ticket from './components/ticket';
import InfoCliente from './components/infocliente';



function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [countProducts, setCountProducts] = useState(0);

  return (
    <Router>
      <Routes>
  
         <Route 
          path="/"
          element={
            <Home
              allProducts={allProducts}
              setAllProducts={setAllProducts}
              total={total}
              setTotal={setTotal}
              countProducts={countProducts}
              setCountProducts={setCountProducts}
            />
          }
        />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/info-cliente" element={<InfoCliente />} />
      </Routes>
    </Router>
  );
}

export default App;
