import express, { Request, Response } from "express";
import mongoose from "mongoose";

import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from "@luxticketing/common";
import { Order, OrderStatus } from "../models/order";
import { body } from "express-validator";

const router = express.Router();

router.delete(
	"/api/orders/:orderId",
	requireAuth.toString,
	[
		body("orderId")
			.notEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("orderId must be provided"),
	],
	validateRequest.toString,
	async (req: Request, res: Response) => {
		const { orderId } = req.params;

		const order = await Order.findById(orderId);

		if (!order) {
			throw new NotFoundError();
		}

		if (order?.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		order.status = OrderStatus.Cancelled;
		await order.save();

		res.status(204).send(order);
	},
);

export { router as deleteOrderRouter };
