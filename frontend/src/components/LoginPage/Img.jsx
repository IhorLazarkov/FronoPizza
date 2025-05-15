import { useRef, useState, useEffect } from "react"

export function Img({ name, url }) {

    const imgRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (imgRef.current) {
            imgRef.current.onload = () => {
                setIsLoading(false);
            }
        }
    }, [])

    return (
        <div className="img_container">
            {isLoading
                ? <div className={`spinner on`} style={{
                    width: "25px",
                    height: "25px",
                    border: "4px solid #ddd",
                    borderTop: "4px solid var(--primary-v1)",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}> </div>
                : <div className={`spinner off`}></div>}
            <img
                ref={imgRef}
                src={url}
                style={{ opacity: isLoading ? 0 : 1 }}
                loading='lazy'
                alt={name} />
        </div>
    )
}