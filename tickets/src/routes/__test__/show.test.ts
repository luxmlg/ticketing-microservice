import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("returs a 404 if the ticket is not found", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returs the ticket if the ticket is found", async () => {
	const title = "SOME TITLE";
	const price = 10;

	const res = await request(app).post("/api/tickets").set("Cookie", global.signin()).send({
		title,
		price,
	});

	const ticketResponse = await request(app).get(`/api/tickets/${res.body.id}`).expect(200);

	expect(ticketResponse.body.title).toEqual(title);
	expect(ticketResponse.body.price).toEqual(price);
});
