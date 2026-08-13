import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./StudentCn.js";
import IsLogin from "../../Middleware/IsLogin.js";
import IsAdmin from "../../Middleware/IsAdmin.js";
import { validateRequest } from "../../Utils/validateRequest.js";
import { createStudentValidator, updateStudentValidator } from "./StudentValidation.js";

const studentRouter = Router();

studentRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, validateRequest(createStudentValidator), create);

studentRouter.route("/:id")
  .get(getOne)
  .patch(IsLogin, IsAdmin, validateRequest(updateStudentValidator), update)
  .delete(IsLogin, IsAdmin, remove);

export default studentRouter;