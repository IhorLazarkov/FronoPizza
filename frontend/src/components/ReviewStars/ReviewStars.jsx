import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

export default function ReviewStars({ rating, setRating }) {

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "2.5rem"
        }}>
            {Array.from({ length: 5 }, (_, x) => x + 1).map((i) => {

                if (i <= rating)
                    return <FaStar
                        key={i}
                        style={{ color: "gold", cursor: "pointer" }}
                        onClick={() => setRating(i)} />

                else
                    return <CiStar
                        key={i}
                        style={{ cursor: "pointer" }}
                        onClick={() => setRating(i)} />
            })}
        </div>
    )
}