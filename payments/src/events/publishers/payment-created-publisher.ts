import { Subjects, Publisher, PaymentCreatedEvent } from "@luxticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
