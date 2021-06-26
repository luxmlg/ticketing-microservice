import { Publisher, OrderCreatedEvent, Subjects } from "@luxticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
