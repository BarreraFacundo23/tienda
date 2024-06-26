import React, { useState } from 'react';
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';

const Ticket = () => {
  const location = useLocation();
  const { allProducts, total: initialTotal } = location.state || { allProducts: [], total: 0 };
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  
  let adjustedTotal = initialTotal;

  if (paymentMethod === 'tarjeta') {
    adjustedTotal = initialTotal * 1.1; //10% aumento
  } else if (paymentMethod === 'efectivo') {
    adjustedTotal = initialTotal * 0.9; //10% descuento
  }

  //MERCADO PAGO

  const [preferenceid, setPreferenceId] = useState(null);

	initMercadoPago("APP_USR-edd261c0-2179-4cb7-a063-fcade0a0801c", {
    locale: "es-AR",
  });

	const createPreference = async(products) => {
		try {
			const response = await axios.post("http://localhost:3003/create_preference",
      {items:products}
       
			);
			
			const { id } = response.data;
			return id;
		} catch (error){
			console.log(error);
		}
	};

	const handleBuy = async (products) => {
     const id = await createPreference(products);
	 if (id) {
		setPreferenceId(id);
	 }
	};

  return (
    <div id="ticket-container">
      <div id="d1">
        <h1 id="t1">Compra Confirmada</h1>
        <p id="p1">Gracias por tu compra.</p>
        <h2 id="sub1">Resumen de la compra:</h2>
        <ul id="productos">
          {allProducts.map(product => (
            <li key={product.id}>
              {product.quantity} x {product.nameProduct} - ${product.price}
            </li>
          ))}
        </ul>
        <h3>Total: ${adjustedTotal.toFixed(2)}</h3>
        <div>
          <button onClick={()=>handleBuy(allProducts)}>Comprar</button>
          {preferenceid && <Wallet initialization={{ preferenceid }} />}

        </div>
      </div>
      <div className="info-cliente">
        <h2>Información del Cliente</h2>
        <form>
          <div>
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required />
          </div>
          <div>
            <label htmlFor="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" required />
          </div>
          <div>
            <label htmlFor="dni">DNI:</label>
            <input type="number" id="dni" name="dni" inputMode="numeric" required />
          </div>
          <div>
            <label htmlFor="direccion">Dirección:</label>
            <input type="text" id="direccion" name="direccion" required />
          </div>
          <div>
            <label htmlFor="codigo-postal">Código Postal:</label>
            <input type="text" id="codigo-postal" name="codigo-postal" required />
          </div>
          <div className="button-container">
            <button type="submit">Enviar</button>
            <Link to="/">
              <button className="btn-volver" type="button">Volver a la Tienda</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Ticket;