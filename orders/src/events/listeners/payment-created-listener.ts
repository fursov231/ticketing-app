import {Listener, OrderStatus, PaymentCreatedEvent, Subjects} from "@vkassa/common"
import {queueGroupName} from "./queue-group-name"
import {Message} from "node-nats-streaming"
import {Order} from "../../models/order"

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
    queueGroupName = queueGroupName

    async onMessage (data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.id)

        if (!order) {
            throw new Error("Order not found")
        }

        order.set({
            status: OrderStatus.Complete //т.к. мы не подразумеваем последующее изменение, то version не обновляем
        })
        await order.save()

        msg.ack()
    }
}