import {PaymentCreatedEvent, Publisher, Subjects} from "@vkassa/common"

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}