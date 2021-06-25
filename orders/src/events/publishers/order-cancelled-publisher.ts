import { Publisher, OrderCancelledEvent, Subjects } from "@luxticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
