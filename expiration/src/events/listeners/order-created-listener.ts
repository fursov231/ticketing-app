import {Listener, OrderCreatedEvent, Subjects} from "@vkassa/common"
import {queueGroupName} from "./queue-group-name"
import {Message} from "node-nats-streaming"
import {expirationQueue} from "../../queues/expiration-queue"

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime() // разница во времени между будущим заданным и текущим, время в мили сек
        console.log("Waiting this many milliseconds to process the job:", delay)
        await expirationQueue.add(
            {
                orderId: data.id
            },
            {
                delay //: 10000 //10sec
            })
        msg.ack()
    }
}