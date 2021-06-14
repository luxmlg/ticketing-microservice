import { response } from "express";
import request from "supertest";
import { app } from "../../app";

it("fails when a email that does not exist is sipplied", async () => {
	await request(app)
		.post("/api/users/signin")
		.send({ email: "test@example.com", password: "password" })
		.expect(400);
});

it("fails when an incorrent password is supplied", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@example.com",
			password: "password",
		})
		.expect(201);

	await request(app)
		.post("/api/users/signin")
		.send({
			email: "test@example.com",
			password: "incorrect-password",
		})
		.expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@example.com",
			password: "password",
		})
		.expect(201);

	const res = await request(app)
		.post("/api/users/signin")
		.send({
			email: "test@example.com",
			password: "password",
		})
		.expect(200);

	expect(res.get("Set-Cookie")).toBeDefined();
});
