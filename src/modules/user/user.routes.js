import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { deleteProfile, getAccountsByRecoveryEmail, getMyProfile, getProfile, updatePassword, updateProfile } from "./user.controller.js";
import { auth } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import { passwordUpdateVal, userUpdateVal } from "./user.validation.js";

const userRouter = Router();

userRouter.get("/", auth, asyncHandler(getMyProfile));
userRouter.get("/accounts-by-recovery-email", auth, asyncHandler(getAccountsByRecoveryEmail));
userRouter.get("/:id", asyncHandler(getProfile));
userRouter.delete("/", auth, asyncHandler(deleteProfile));
//userRouter.post("/", auth, asyncHandler(forgetPassword)); 
userRouter.put("/update-user", auth,validation(userUpdateVal), asyncHandler(updateProfile));
userRouter.put("/update-password", auth,validation(passwordUpdateVal), asyncHandler(updatePassword));

export { userRouter };

