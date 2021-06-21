import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

import jwt from "jsonwebtoken";

declare global {
	namespace NodeJS {
		interface Global {
			signin(): string[];
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
global.signin = () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	const payload = {
		id,
		email: "test@example.com",
	};

	const token = jwt.sign(payload, process.env.JWT_KEY!);

	const session = { jwt: token };

	const sessionJSON = JSON.stringify(session);

	const base64 = Buffer.from(sessionJSON).toString("base64");

	return [`express:sess=${base64}`];
};
