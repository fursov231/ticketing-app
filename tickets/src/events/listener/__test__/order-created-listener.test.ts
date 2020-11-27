import mongoose from "mongoose"
import {natsWrapper} from "../../../nats-wrapper"
import {OrderCreatedListener} from "../order-created-listener"
import {Ticket} from "../../../models/ticket"
import {OrderCreatedEvent, OrderStatus} from "@vkassa/common"
import {Message} from "node-nats-streaming"


const setup = async () => {
    //Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client)
    //Create and save a ticket
    const ticket = await Ticket.build({
        title: "film",
        price: 500,
        userId: "Boris111",
    })
    await ticket.save()
    //Create the fake data event
    const data: OrderCreatedEvent["data"] = {
        id: mongoose.Types.ObjectId().toHexString(), // = orderId
        version: 0,
        status: OrderStatus.Created,
        userId: "qwer",
        expiresAt: "qwert",
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {listener, ticket, data, msg}
}

it("set the userId of the ticket", async () => {
    const {listener, ticket, data, msg} = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)

})

it("acks the message", async () => {
    const {listener, data, msg} = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it("publishes a ticket updated event", async () => {
    const {listener, data, msg} = await setup()

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1] // говорит TS что что это mock функция
    )

    expect(ticketUpdatedData.orderId).toEqual(data.id)

})