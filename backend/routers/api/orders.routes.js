import express from "express";
import { orderValidationRules } from "#validators/order.validation";

export default function ordersRoutes(
    ordersController
) {

    const router = express.Router();

    router.post("/", ordersController.createOrder.bind(ordersController));

    router.get("/all", ordersController.list.bind(ordersController));

    router.get("/:id", orderValidationRules.get, ordersController.findOrder.bind(ordersController));
    router.put("/:id", orderValidationRules.get, ordersController.updateOrder.bind(ordersController));
    router.delete("/:id", orderValidationRules.delete, ordersController.deleteOrder.bind(ordersController));


    return router;
}