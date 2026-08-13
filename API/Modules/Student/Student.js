import { Router } from "express";
import { create, getAll, getOne, remove, update } from "./StudentCn.js";
import { IsLogin, IsAdmin } from "./authMiddlewares.js";

const studentRouter = Router();

studentRouter.route("/")
  .get(getAll)
  .post(IsLogin, IsAdmin, create);

studentRouter.route("/:id")
  .get(getOne)
  .patch(IsLogin, IsAdmin, update)
  .delete(IsLogin, IsAdmin, remove);

export default studentRouter;