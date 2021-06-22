import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("retunrs a 404 if the provided id does not exist", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set("Cookie", global.signin())
		.send({
			title: "SOME TITLE",
			price: 10,
		})
		.expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: "SOME TITLE",
			price: 10,
		})
		.expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
	const res = await request(app).post("/api/tickets").set("Cookie", global.signin()).send({
		title: "SOME TITLE",
		price: 10,
	});

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set("Cookie", global.signin())
		.send({
			title: "ANOTHER TITLE",
			price: 20,
		})
		.expect(401);
});

it("retunrs a 400 if the user provides an invalid title or price", async () => {
	const cookie = global.signin();

	const res = await request(app).post("/api/tickets").set("Cookie", cookie).send({
		title: "SOME TITLE",
		price: 10,
	});

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 20,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "ANOTHER TITLE",
			price: -20,
		})
		.expect(400);
});

it("updates the ticket provided valid inputs", async () => {
	const cookie = global.signin();

	const res = await request(app).post("/api/tickets").set("Cookie", cookie).send({
		title: "SOME TITLE",
		price: 10,
	});

	const newTitle = "ANOTHER TITLE";
	const newPrice = 20;
	await request(app)
		.put(`/api/tickets/${res.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: newTitle,
			price: newPrice,
		})
		.expect(200);

	const ticketResponse = await request(app).get(`/api/tickets/${res.body.id}`).send();

	expect(ticketResponse.body.title).toEqual(newTitle);
	expect(ticketResponse.body.price).toEqual(newPrice);
});
