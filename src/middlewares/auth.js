import jwt from "jsonwebtoken";
import { AppError } from "../utilties/appError.js";
import { messages } from "../utilties/commons/messages.js";
import { userStatus } from "../utilties/commons/enums.js";
import { User } from "../../database/models/user.model.js";

export const auth =  (roles) => {
  return async (req, res, next) => {
    const authrization = req.headers.authorization;
  if (!authrization) {
    next(new AppError(messages.token.required, 400));
  }
  if (!authrization?.startsWith("Bearer ")) {
    next(new AppError(messages.token.invalidBearerKey, 400));
  }
  const token = authrization.split(" ")[1];
  const decoded = jwt.verify(token, "thisIsMySecterKeyForAuth");
  if (!decoded?.id) {
    next(new AppError(messages.token.wrongPayload, 400));
  }
  const authUser = await User.findOne({_id: decoded.id})
  if (!authUser) {
    next(new AppError(messages.user.userNotFound, 400));
  }
  if (authUser?.status == userStatus.offline) {
    next(new AppError(messages.user.mustLogin, 400));
  }
  if (!roles.includes(authUser?.role)) {
    return next(new AppError(messages.user.notAuthrized, 401));
  }
  req.authUser = authUser;
  next();
  };
};
