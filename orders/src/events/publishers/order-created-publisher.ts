import {OrderCreatedEvent, Publisher, Subjects} from "@vkassa/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}

