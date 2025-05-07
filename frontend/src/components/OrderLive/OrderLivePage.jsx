import "./OrderLive.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrderLivePage() {
  const { id } = useParams();
  const [status, setStatus] = useState([]);
  const [connStatus, setConnStatus] = useState("off");
  const [spinnerStatus, setSpinnerStatus] = useState("off");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const onGoBackClick = () => {
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
      setStatus(prev => [...prev, status]);
    }

    ws.onopen = () => {
      setConnStatus('on')
      setSpinnerStatus('on')
      console.log("connection open");
      ws.send(JSON.stringify({ order_id: id }));
    }

    ws.onerror = (err) => {
      console.error({ err });
      // setError(`Connection error: ${JSON.stringify(err)}`);
    }

    ws.onclose = () => {
      console.log("connection closed");
      setConnStatus('off')
      setSpinnerStatus('off')
    }

    return () => {
      ws.close();
    };
  }, [])

  return (
    <div className="order-live-container">
      <h4>Connection status:
        <span>
          {connStatus === "on"
            ? <span style={{
              backgroundColor: "var(--secondary-v1)",
              color: "var(--sub-secondary-v1)",
              padding: "6px",
              marginLeft: "8px"
            }}>ON</span>
            : <span style={{
              backgroundColor: "var(--primary-v1)",
              color: "var(--sub-secondary-v1)",
              padding: "6px",
              marginLeft: "8px"
            }}>OFF</span>}
        </span>
      </h4>
      <h3 style={{ position: "relative" }} >Order: {id}
        <div className={`spinner ${spinnerStatus}`} style={{
          width: "25px",
          height: "25px",
          border: "4px solid #ddd",
          borderTop: "4px solid var(--primary-v1)",
          borderRadius: "50%",
          position: "absolute",
          top:"0",
          left: "-3rem",
        }}> </div>
      </h3>

      <ul style={{ fontSize: '1.2rem', listStyle: 'inside' }}>
        {status.map((status, index) => (
          <li key={index}>{status}</li>
        ))}
      </ul>
      <button
        className="primary"
        onClick={onGoBackClick}
      >Go back to menu</button>
      {error !== "" && <p style={{
        color: 'red'
      }}>{error}</p>}
    </div>
  );
}