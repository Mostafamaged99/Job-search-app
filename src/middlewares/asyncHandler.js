import { AppError } from "../utilties/appError.js";

export const asyncHandler = (callback) => {
  return (req, res, next) => {
    callback(req, res, next).catch((err) => {
      if (err) {
        next(new AppError(err.message, err.statusCode));
      }
    });
  };
};

export const globalHandlingError = (err, req, res, next) => {
  return res
    .status(err.statusCode || 500)
    .json({ message: err.message, success: false });
};
