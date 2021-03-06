import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
	namespace NodeJS {
		interface Global {
			signin(): Promise<string[]>;
		}
	}
}

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = "TESTSECRET";
	mongo = new MongoMemoryServer();
	const mongoUri = await mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

// This function could be a helper function not a global one
global.signin = async () => {
	const email = "test@example.com";
	const password = "password";

	const res = await request(app).post("/api/users/signup").send({ email, password }).expect(201);

	const cookie = res.get("Set-Cookie");

	return cookie;
};
