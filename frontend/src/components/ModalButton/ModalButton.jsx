import { useModal } from "../../context/Modal";

export default function ModalButton({
    className,
    style,
    modalComponent, // component to render inside the modal
    buttonText, // text of the button that opens the modal
    onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
    onModalClose // optional: callback function that will be called once the modal is closed
}) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onButtonClick === "function") onButtonClick();
    };

    return (
        <button
            className={className}
            style={style}
            onClick={onClick}
        >{buttonText}</button>
    );
}