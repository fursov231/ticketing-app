import {Publisher, Subjects, TicketCreatedEvent} from "@vkassa/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
     subject: Subjects.TicketCreated = Subjects.TicketCreated

}

