import {Listener} from "./base-listener"
import {Message} from "node-nats-streaming"
import {TicketCreatedEvent} from "./ticket-created-event";
import {Subjects} from "./subjects"

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated //из publisher`a, readonly означает что свойства не будут меняться
    queueGroupName = "payments-service"

    onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        console.log("Event data", data)
        console.log(data.title)
        msg.ack() //помечает сообщение как успешно переданное
    }
}