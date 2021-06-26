import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent } from "@luxticketing/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const ticket = Ticket.build({
		title: "SOME TICKET",
		price: 10,
		userId: mongoose.Types.ObjectId().toHexString(),
	});

	const orderId = mongoose.Types.ObjectId().toHexString();
	ticket.set({ orderId });

	await ticket.save();

	const data: OrderCancelledEvent["data"] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, orderId, data, msg };
};

it("updates the ticket and publishes an event", async () => {
	const { listener, ticket, orderId, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.orderId).not.toBeDefined();
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("acks the message", async () => {
	const { listener, ticket, orderId, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
