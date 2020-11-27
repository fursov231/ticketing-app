import {natsWrapper} from "../../../nats-wrapper"
import {TicketUpdatedListener} from "../ticket-updated-listener"
import mongoose from "mongoose"
import {Ticket} from "../../../models/ticket"
import {TicketUpdatedEvent} from "@vkassa/common"
import {Message} from "node-nats-streaming"

const setup = async () => {
    //Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    //Create and save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: "film",
        price: 250
    })
    await ticket.save()

    //Create a fake data object
    const data: TicketUpdatedEvent["data"] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: "new film",
        price: 350,
        userId: "qwertylop"
    }

    //Create a fake msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    //return all of this stuff
    return {msg, ticket, data, listener}

}

it("finds, updates, and saves a ticket", async () => {
    const {msg, ticket, data, listener} = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it("acks the message", async () => {
    const {msg, data, listener} = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it("doesn`t call ack if the event has a skipped version number", async () => {
    const {msg, data, listener} = await setup()

    data.version = 10

    try {
        await listener.onMessage(data, msg)
    } catch (err) {
    }

    expect(msg.ack).not.toHaveBeenCalled()
})