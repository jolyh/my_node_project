import express from "express";
import { taskValidationRules } from "#validators/task.validation";

export default function tasksRoutes(
    tasksController
) {

    const router = express.Router();

    router.post("/", taskValidationRules.create, tasksController.createTask.bind(tasksController));

    router.get("/all", tasksController.list.bind(tasksController));
    router.get("/author/:authorId", tasksController.findByAuthorId.bind(tasksController));

    router.get("/:id", taskValidationRules.get, tasksController.findTask.bind(tasksController));
    router.put("/:id", taskValidationRules.update, tasksController.updateTask.bind(tasksController));
    router.delete("/:id", taskValidationRules.delete, tasksController.deleteTask.bind(tasksController));

    return router;
}
