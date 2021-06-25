import { Publisher, Subjects, TicketCreatedEvent } from "@luxticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
