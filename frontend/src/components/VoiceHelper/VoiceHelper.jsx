import "./VoiceHelper.css";
import { useState, useContext, createContext, useEffect, use } from "react";
import { BsMicFill } from "react-icons/bs";
import { HiStop } from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";
import { addIngredientToCart, addPizzaToCart } from '../../store/cart';

const CommandContext = createContext();
const useCommandContext = () => useContext(CommandContext);

export default function VoiceHelper({ clazzName }) {

    const dispatch = useDispatch();
    const pizzas = useSelector((state) => state.pizzas);
    const ingredients = useSelector((state) => state.ingredients);

    const [products, setProducts] = useState([]);
    const [command, setCommand] = useState([]);
    const [userCommand, setUserCommand] = useState([
        {
            client: "agent",
            command: "Hey, I am here to help you. I can understand what you say and add pizzas to your cart for you"
        }, {
            client: "agent",
            command: "Please click on the mic to start speaking"
        }, {
            client: "agent",
            command: "And when you done, click the red square to stop"
        }, {
            client: "agent",
            command: "What would you like to order today?"
        }
    ]);

    const contextValue = { setUserCommand, setProducts }

    useEffect(() => {
        const tmIndex = setTimeout(() => {
            setCommand(prev => {
                return [
                    ...prev,
                    userCommand[userCommand.length - 1]
                ];
            });
        }, 200)

        return () => clearTimeout(tmIndex);
    }, [userCommand])

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
            setTimeout(() => {
                setUserCommand(prev => {
                    const products = addedProducts.map(p => p.name).join(",")
                    const cmd = `I just added ${products} to your cart`
                    return [...prev, { client: "agent", command: cmd }];
                });
            }, 300)
        }
    }, [products])

    return (
        <div
            id="voice_helper"
            className={clazzName}
        >
            <CommandContext.Provider value={contextValue}>
                {clazzName.indexOf("show") > 0
                    && userCommand.length > 0 &&
                    userCommand.map(({ client, command }, i) => {
                        return <div key={i} className={client}>{command}</div>
                    })}
                <ButtonMic />
            </CommandContext.Provider>
        </div>
    )
}

function ButtonMic() {
    const [isRecording, setIsRecording] = useState(false);
    const { recognition, eventTarget } = window;
    const { setUserCommand, setProducts } = useCommandContext()

    const onStartRecording = () => {
        recognition.start();
    }
    const onStopRecording = () => {
        recognition.stop();
    }

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        eventTarget.addEventListener("data", (data) => {
            const { finalRecognizedWords, products } = data.detail;

            setProducts([...products]);
            setUserCommand(prev => [...prev, { client: "client", command: finalRecognizedWords }]);
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