import express, { Request, Response } from "express";
import mongoose from "mongoose";

import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from "@luxticketing/common";
import { Order } from "../models/order";
import { body } from "express-validator";

const router = express.Router();

router.get(
	"/api/orders/:orderId",
	requireAuth,
	[
		body("orderId")
			.notEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("orderId must be provided"),
	],
	async (req: Request, res: Response) => {
		const order = await Order.findById(req.params.orderId).populate("ticket");
		if (!order) {
			throw new NotFoundError();
		}

		if (order.userId != req.currentUser!.id) {
			throw new NotAuthorizedError();
		}
		res.send({});
	},
);

export { router as showOrderRouter };
