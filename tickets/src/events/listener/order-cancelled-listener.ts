import {Listener, OrderCancelledEvent, Subjects} from "@vkassa/common"
import {queueGroupName} from "./queue-group-name"
import {Message} from "node-nats-streaming"
import {Ticket} from "../../models/ticket"
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher"

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)

        if (!ticket) {
            throw new Error("Ticket not found")
        }

        ticket.set({orderId: undefined}) // ? - необязательный тег в описании класса в TS плохо работает с null
        await ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version
        })
        msg.ack()
    }
}