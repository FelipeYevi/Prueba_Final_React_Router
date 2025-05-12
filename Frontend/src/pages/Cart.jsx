import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";  
import { useUser } from "../context/userContext";
import axios from "axios";

const Cart = () => {
  const { cart, removeFromCart, addToCart, total } = useCart();  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = useUser();

  useEffect(() => {
    const getPizzas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pizzas");
        if (!response.ok) {
          throw new Error("Error al obtener las pizzas");
        }
        await response.json();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getPizzas();
  }, []);

  const handleCheckout = async () => {
    if (!token) {
      setError("Debe iniciar sesión para pagar");
      return; 
    }

    try {
      const payload = {
        items: cart.map((pizza) => ({
          id: pizza.id,
          quantity: pizza.quantity,
        })),
      };

      const response = await axios.post("http://localhost:5000/api/checkouts", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccessMessage("Checkout realizado con éxito");
    } catch (err) {
      setError(err.response?.data?.error || "Error en el checkout");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (cart.length === 0) return <div>No hay pizzas en el carrito</div>;

  return (
    <div className="container mt-4">
      <h2>Detalles del pedido:</h2>
      <ul className="list-group">
        {cart.map((pizza) => (
          <li key={pizza.id} className="list-group-item d-flex align-items-center">
            <img src={pizza.img} alt={pizza.name} className="me-3" style={{ width: "100px", height: "100px" }} />
            <span className="me-auto">{pizza.name}</span>
            <span className="me-3">${pizza.price.toLocaleString()}</span>
            <button className="btn btn-outline-danger me-2" onClick={() => removeFromCart(pizza.id)}>-</button>
            <span>{pizza.quantity}</span>
            <button className="btn btn-outline-primary ms-2" onClick={() => addToCart(pizza)}>+</button>
          </li>
        ))}
      </ul>
      <h3 className="mt-3">Total: ${total.toLocaleString()}</h3>
      <button className="btn btn-dark mt-2" onClick={handleCheckout}>Pagar</button>
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
    </div>
  );
};

export default Cart;
