import express from "express";
// TODO 
// import { orderValidationRules } from "../../validationRules/orderValidationRules.js";

export default function orderRoutes(
    orderController,
    ordersController
) {

    const router = express.Router();

    router.get("/", async (req, res) => { res.redirect("/orders.html"); });
    router.post("/", orderController.createOrder.bind(orderController));

    router.get("/all", ordersController.list.bind(ordersController));

    router.get("/:id", orderController.findOrder.bind(orderController));
    router.put("/:id", orderController.updateOrder.bind(orderController));
    router.delete("/:id", orderController.deleteOrder.bind(orderController));


    return router;
}