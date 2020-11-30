import {ExpirationCompleteListener} from "../expiration-complete-listener"
import {natsWrapper} from "../../../nats-wrapper"
import {Order} from "../../../models/order"
import {Ticket} from "../../../models/ticket"
import mongoose from "mongoose"
import {ExpirationCompleteEvent, OrderStatus} from "@vkassa/common"
import {Message} from "node-nats-streaming"

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "FILM",
        price: 200,
    })
    await ticket.save()

    const order = Order.build({
        status: OrderStatus.Cancelled,
        userId: "one",
        expiresAt: new Date(),
        ticket
    })
    await order.save()

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener, order, ticket, data, msg}
}

it("updates the order status to cancelled", async () => {
    const {listener, order, data, msg} = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("emit an OrderCancelled event", async () => {
    const {listener, order, data, msg} = await setup()

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])  //jest-mock ф-ция, с помощью mock.calls получаем доступ к массиву всех вызовов, когда вызывалась ф-ция, 0-й элемент - subject (название канала), ф-ция возвращает объект данных json

    expect(eventData.id).toEqual(order.id)
})

it("ack the message", async () => {
    const {listener, data, msg} = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})