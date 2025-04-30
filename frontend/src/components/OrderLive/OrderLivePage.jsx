import { useParams } from "react-router-dom";

export default function OrderLivePage() {
  
  const { id } = useParams();

  return (
    <div>
      <span>OrderLivePage</span>
      <span>Tracking Order: {id}</span>
    </div>
  );
}