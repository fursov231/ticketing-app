import {useEffect, useState} from "react"
import StripeCheckout from "react-stripe-checkout"
import useRequest from "../../hooks/use-request"
import Router from "next/router"

const OrderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0) //Countdown to 0 seconds
    const {doRequest, errors} = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id,
        },
        onSuccess: () => Router.push("/orders")
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date()
            setTimeLeft(Math.round(msLeft / 1000))
        }
        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000)

        return () => { // When we switch to another component or rerendering the component
            clearInterval(timerId)
        }
    }, [order]) // [order] - dependencies for the function to work once

    if (timeLeft < 0) {
        return <div>Истек срок оплаты заказа</div>
    }

    return (<div>Осталось времени для оплаты: {timeLeft} секунд
            <StripeCheckout
                token={({id}) => doRequest({token: id})}
                stripeKey="pk_test_51HtzoDBmzZqQ8xaZRdTVDvZBq73Tlqa1VRShNcZOaZb4VORi17EAo0e4GKIAmJgizUnAdVsrMfD1LMlJVHFanmCS00wnBLtVpC"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    )


}

OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query //id from url
    const {data} = await client.get(`/api/orders/${orderId}`)

    return {order: data} //Return data as order

}

export default OrderShow