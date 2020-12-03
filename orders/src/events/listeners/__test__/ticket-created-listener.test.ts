import mongoose from "mongoose"
import {TicketCreatedEvent} from "@vkassa/common"
import {TicketCreatedListener} from "../ticket-created-listener"
import {natsWrapper} from "../../../nats-wrapper"
import {Message} from "node-nats-streaming"
import {Ticket} from "../../../models/ticket"

const setup = async () => {

    //create an instance of the listeners
    const listener = new TicketCreatedListener(natsWrapper.client)

    //create a fake data event
    const data: TicketCreatedEvent["data"] = {

        version: 0,
        id: mongoose.Types.ObjectId().toHexString(),
        title: "FILM",
        price: 1000,
        userId: mongoose.Types.ObjectId().toHexString()
    }

    //create a fake message object
    //@ts-ignore // не имплементируем нарочно Message корректно, т.к. не нужны все методы
    const msg: Message = {
        ack: jest.fn() //для вызова mock функции
    }
    return {listener, data, msg}
}

it("creates and saves a ticket", async () => {

    const {listener, data, msg} = await setup()

    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
    //write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title) //ts не уверен, что что-то найдено в ticket
    expect(ticket!.price).toEqual(data.price)

})

it("acks the message", async () => {
    const {listener, data, msg} = await setup()
    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
    //write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled()
})