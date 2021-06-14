import { response } from "express";
import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({ email: "test@example.com", password: "password" })
		.expect(201);
});

it("returns a 400 with an invalid email", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({ email: "invalid-email", password: "password" })
		.expect(400);
});

it("returns a 400 with an invalid password", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({ email: "test@example.com", password: "pa" })
		.expect(400);
});

it("returns a 400 with an missing email and password", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({ email: "", password: "password" })
		.expect(400);

	return request(app)
		.post("/api/users/signup")
		.send({ email: "test@example.com", password: "" })
		.expect(400);
});

it("disallows duplicate emails", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({ email: "test@example.com", password: "password" })
		.expect(201);

	return request(app)
		.post("/api/users/signup")
		.send({ email: "test@example.com", password: "password" })
		.expect(400);
});

it("sets a cookie after a successful signup", async () => {
	const res = await request(app)
		.post("/api/users/signup")
		.send({ email: "test@example.com", password: "password" })
		.expect(201);

	expect(res.get("Set-Cookie")).toBeDefined();
});
