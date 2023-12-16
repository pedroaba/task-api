import { buildPath } from "../utils/build-path";
import { tasksRoutes } from "./tasks"

export const routes = [
  {
    method: "GET",
    path: buildPath("/tasks"),
    handler: tasksRoutes.listTasks
  },
  {
    method: "POST",
    path: buildPath("/tasks"),
    handler: tasksRoutes.insertTask
  },
  {
    method: "PUT",
    path: buildPath("/tasks/:id"),
    handler: tasksRoutes.updateTask
  },
  {
    method: "DELETE",
    path: buildPath("/tasks/:id"),
    handler: tasksRoutes.deleteTask
  },
  {
    method: "PATCH",
    path: buildPath("/tasks/:id/complete"),
    handler: tasksRoutes.toggleTaskComplete
  }
];
