import express, {Request, Response} from "express"
import {NotAuthorizedError, NotFoundError, OrderStatus, requireAuth} from "@vkassa/common"
import {Order} from "../models/order"
import {OrderCancelledPublisher} from "../events/publishers/order-cancelled-publisher"
import {natsWrapper} from "../nats-wrapper"


const router = express.Router()

router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    const {orderId} = req.params
    const order = await Order.findById(orderId).populate("ticket") //populate чтобы достать id ticket`a

    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    //publishing an event saying this was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id, //вытащили с помощью populate в findByID

        }
    })

    res.status(204).send(order)
})


export {router as deleteOrderRouter}