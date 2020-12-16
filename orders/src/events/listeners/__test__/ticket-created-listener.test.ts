import mongoose from "mongoose"
import {TicketCreatedEvent} from "@vkassa/common"
import {TicketCreatedListener} from "../ticket-created-listener"
import {natsWrapper} from "../../../nats-wrapper"
import {Message} from "node-nats-streaming"
import {Ticket} from "../../../models/ticket"

const setup = async () => {

    //Create an instance of the listeners
    const listener = new TicketCreatedListener(natsWrapper.client)

    //Create a fake data event
    const data: TicketCreatedEvent["data"] = {

        version: 0,
        id: mongoose.Types.ObjectId().toHexString(),
        title: "FILM",
        price: 1000,
        userId: mongoose.Types.ObjectId().toHexString()
    }

    //Create a fake message object
    //We don`t implement Message correctly because all methods aren`t needed
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn() //for invoke mock func
    }
    return {listener, data, msg}
}

it("creates and saves a ticket", async () => {

    const {listener, data, msg} = await setup()

    //Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
    //Write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title) //! - because TS not sure if smth was found in ticket
    expect(ticket!.price).toEqual(data.price)

})

it("acks the message", async () => {
    const {listener, data, msg} = await setup()
    //Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
    //Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled()
})