import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./EventCn.js";
import { IsLogin } from "../../Middleware/IsLogin.js";
import { IsAdmin } from "../../Middleware/IsAdmin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import { createEventValidator, updateEventValidator } from "./EventValidation.js";

const eventRouter = Router();

eventRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createEventValidator), create);

eventRouter.route("/:id")
  .get(getOne)
  .patch(IsLogin, IsAdmin, validateRequest(updateEventValidator), update)
  .delete(IsLogin, IsAdmin, remove);

export default eventRouter;