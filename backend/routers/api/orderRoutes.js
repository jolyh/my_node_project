import express from "express";
import { orderValidationRules } from "../../validationRules/ordersValidationRules.js";

export default function orderRoutes(
    orderController,
    ordersController
) {

    const router = express.Router();

    router.get("/", async (req, res) => { res.redirect("/orders.html"); });
    router.post("/", orderController.createOrder.bind(orderController));

    router.get("/all", ordersController.list.bind(ordersController));

    router.get("/:id", orderValidationRules.get, orderController.findOrder.bind(orderController));
    router.put("/:id", orderValidationRules.get, orderController.updateOrder.bind(orderController));
    router.delete("/:id", orderValidationRules.delete, orderController.deleteOrder.bind(orderController));


    return router;
}