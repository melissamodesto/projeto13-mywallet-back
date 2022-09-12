import { Router } from "express";
import { signInUser, signUpUser } from "./../controllers/auth.controller.js";
import {
  validateNewUserData,
  validateUserData,
} from "./../schemas/user.schema.js";

const authRouter = Router();

authRouter.get("/sign-in", (req, res) => {
  res.send("Auth router");
});
authRouter.post("/sign-in", validateUserData, signInUser);
authRouter.post("/sign-up", validateNewUserData, signUpUser);

export default authRouter;
