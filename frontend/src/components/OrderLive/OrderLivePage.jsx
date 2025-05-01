import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrderLivePage() {
  const { id } = useParams();
  const [status, setStatus] = useState("connecting to server...");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const hadleClick = () => {
    navigate("/");
  };

  //on mount
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001/`);

    ws.onmessage = messgae => {

      const { order_id, status } = JSON.parse(messgae.data);

      if (parseInt(id) !== order_id) {
        setError(`order ${order_id} does not match with ${id}`);
        return;
      };

      setError("");
      setStatus(status);
    }

    ws.onopen = () => {
      console.log("connection open");
      ws.send(JSON.stringify({ order_id: id }));
    }

    ws.onerror = (err) => {
      setError(`Connection error: ${JSON.stringify(err)}`);
    }

    ws.onclose = () => {
      console.log("connection closed");
    }

    return () => {
      ws.close();
    };
  }, [])

  return (
    <div>
      <span>OrderLivePage</span>
      <h3>Tracking Order: {id}</h3>
      <p>Status of your order is: {status}</p>
      <button
        className="primary"
        onClick={hadleClick}
      >Go back to main page</button>
      {error !== "" && <p style={{
        color: 'red',
        fontWeight: 'bold',
        border: '1px solid red',
      }}>{error}</p>}
    </div>
  );
}