import { Router } from "express";
import { signIn, signUp } from "./auth.controller.js";
import { signInVal, signUpVal } from "./auth.validation.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { validation } from "../../middlewares/validation.js";

const authRouter = Router();

//signup
authRouter.post("/signup", validation(signUpVal), asyncHandler(signUp));

//signIn
authRouter.post("/sign-in", validation(signInVal), asyncHandler(signIn));

export { authRouter };
