import { Router } from "express";
import { validateSession } from "../middlewares/userMiddleware.js";
import {
  getStatements,
  postStatement,
  deleteStatement,
  putStatement,
} from "../controllers/statements.controller.js";
import { validateNewstatementData } from "../schemas/statement.schema.js";

const statementsRouter = Router();

statementsRouter.get("/statements", validateSession, getStatements);
statementsRouter.post(
  "/statements",
  validateSession,
  validateNewstatementData,
  postStatement
);
statementsRouter.delete(
  "/statements/:entryId",
  validateSession,
  deleteStatement
);
statementsRouter.put("/statements/:entryId", validateSession, putStatement);

export default statementsRouter;
