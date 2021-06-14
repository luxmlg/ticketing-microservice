import request from "supertest";
import { example } from "yargs";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({ email: "test@example.com", password: "password" })
		.expect(201);
});
