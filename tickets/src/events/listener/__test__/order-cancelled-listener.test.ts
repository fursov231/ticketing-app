import {OrderCancelledListener} from "../order-cancelled-listener"
import {natsWrapper} from "../../../nats-wrapper"
import {Ticket} from "../../../models/ticket"
import mongoose from "mongoose"
import {OrderCancelledEvent} from "@vkassa/common"
import {Message} from "node-nats-streaming"

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = mongoose.Types.ObjectId().toHexString()

    const ticket = Ticket.build({
        title: "FILM",
        price: 350,
        userId: "new user",
    })

    ticket.set({orderId}) //для того, чтобы не менять модель Schem`ы

    await ticket.save()

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {msg, data, ticket, orderId, listener}
}

it ("updates the ticket, publishes an event and acks the message", async () => {
    const {msg, data, ticket, listener} = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).not.toBeDefined()
    expect (msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})