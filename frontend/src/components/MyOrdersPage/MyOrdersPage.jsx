import { useEffect, useState } from 'react'
import './MyOrders.css'
import { getOrders } from '../../store/orders'
import { useDispatch, useSelector } from 'react-redux'
export default function MyOrdersPage() {

    const dispatch = useDispatch()
    const orders = useSelector(state => state.orders)
    const [ordersState, setOrdersState] = useState(orders)

    const arrMonths = ["January", "February", "March",
        "April", "May", "June", "July", "August",
        "September", "October", "November", "December"]

    const printDate = (date) => {
        const dateObj = new Date(date)
        const month = dateObj.getMonth()
        const year = dateObj.getFullYear()
        return `${arrMonths[month]} ${year}`
    }

    useEffect(() => {
        dispatch(getOrders()).then(orders => {
            setOrdersState(orders)
        })
    }, [dispatch])

    return (
        <div className='order-container'>
            {ordersState.map(order => (
                <div key={order.id} className='order'>

                    {/* Order main info */}
                    <div className="order_header">
                        <span>Order ID:</span><span>{order.id}</span>
                        <span>Date: </span><span>{printDate(order.updatedAt)}</span>
                        <span>Status:</span><span>{order.status}</span>
                    </div>

                    {/* Order Items */}
                    <div className="order_items">
                        {order.OrderItems.map(item => (
                            <div key={item.id} className="order_item">
                                {/* Pizzas */}
                                {item.Pizza &&
                                    <>
                                        <span><img src={item.Pizza.image} /></span>
                                        <span className='sub-item'>{item.Pizza.name}</span>
                                        <span className='sub-item'>{item.quantity}</span>
                                    </>
                                }
                                {/* Ingredients */}
                                {item.Ingredient &&
                                    <>
                                        <span><img src={item.Ingredient.image} /></span>
                                        <span className='sub-item'>{item.Ingredient.name}</span>
                                        <span className='sub-item'>{item.quantity}</span>
                                    </>
                                }
                            </div>
                        ))}
                    </div>

                    {/* Total Price */}
                    <div className="order_footer">
                        <span>Total:</span><span>${order.totalPrice}</span>
                    </div>
                    <button className="primary" style={{ width: "100%" }}>Order again</button>
                </div>
            ))}
        </div>
    )
}