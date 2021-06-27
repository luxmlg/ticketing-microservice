import { Subjects, Publisher, ExpirationCompleteEvent } from "@luxticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
