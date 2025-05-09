import "./VoiceHelper.css";
import { useState, useContext, createContext, useRef, useEffect } from "react";
import { BsMicFill } from "react-icons/bs";
import { HiStop } from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";
import { addIngredientToCart, addPizzaToCart } from '../../store/cart';

const CommandContext = createContext();
const useCommandContext = () => useContext(CommandContext);

export default function VoiceHelper({ isHelperShow }) {

    const dispatch = useDispatch();
    const pizzas = useSelector((state) => state.pizzas);
    const ingredients = useSelector((state) => state.ingredients);

    const [products, setProducts] = useState([]);
    const [userCommand, setUserCommand] = useState([]);
    const [commandStructured, setCommandStructured] = useState({
        intent: 0,
        target: 0,
        product: 0,
        finalAction: 0
    });

    const contextValue = { setUserCommand, setCommandStructured, setProducts }

    useEffect(() => {
        const addedProducts = [];
        // pizzas
        for (const p in pizzas) {
            const pizza = pizzas[p];
            products.forEach(pr => {
                const p1 = pizza.name.toString().toLowerCase();
                const p2 = pr.toString().toLowerCase();
                if (p1.indexOf(p2) !== -1) {
                    addedProducts.push(pizza);
                    dispatch(addPizzaToCart(pizza))
                }
            })
        }
        // ingredients
        for (const i in ingredients) {
            const ingredient = ingredients[i];
            products.forEach(pr => {
                const i1 = ingredient.name.toString().toLowerCase();
                const i2 = pr.toString().toLowerCase();
                if (i1.indexOf(i2) !== -1) {
                    addedProducts.push(ingredient);
                    dispatch(addIngredientToCart(ingredient))
                }
            })
        }
        if (addedProducts.length > 0) {
            setUserCommand(prev => {
                const cmd = `I added ${addedProducts.map(p => p.name).join(",")} to your cart`
                return [...prev, cmd];
            });
        }
    }, [products])

    return (
        <div
            id="voice_helper"
            className={isHelperShow
                ? "voice_helper_show"
                : "voice_helper_hide"}
        >
            <CommandContext.Provider value={contextValue}>
                <ButtonMic />
                {userCommand.length > 0 && userCommand.map((c, i) => <p key={i}>{c}</p>)}
            </CommandContext.Provider>
        </div>
    )
}

function ButtonMic() {
    const [isRecording, setIsRecording] = useState(false);
    const { recognition, eventTarget } = window;
    const { setUserCommand, setCommandStructured, setProducts } = useCommandContext()

    const onStartRecording = () => {
        console.log("Recording started");
        recognition.start();
    }
    const onStopRecording = () => {
        console.log("Recording stopped");
        recognition.stop();
    }

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        eventTarget.addEventListener("data", (data) => {
            const { finalRecognizedWords, products, commandStructured } = data.detail;
            console.log({
                finalRecognizedWords,
                products,
                commandStructured
            });

            setProducts([...products]);
            setUserCommand(prev => [...prev, finalRecognizedWords]);
            setCommandStructured({ ...commandStructured });
        }, { signal });
        return () => abortController.abort();
    }, [])

    return (
        <>
            {isRecording
                ? <HiStop style={{ color: "red" }} onClick={() => {
                    setIsRecording(false)
                    onStopRecording()
                }} />
                : <BsMicFill onClick={() => {
                    setIsRecording(true)
                    onStartRecording()
                }} />}
        </>
    )
}