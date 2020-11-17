import {Publisher, Subjects, TicketUpdatedEvent} from "@vkassa/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
