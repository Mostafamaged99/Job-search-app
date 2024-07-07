import joi from "joi";
import { AppError } from "../utilties/appError.js";

export const globalValidation = {
    name: joi.string().min(3).max(20),
    email: joi.string().email(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    mobile: joi.string().pattern(new RegExp("^01[0125][0-9]{8}$")),
    paragraph: joi.string().max(200),
}

export const validation = (schema) => {
  return (req, res, next) => {
    let data = { ...req.body, ...req.params, ...req.query };
    let { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const errArr = error.details.map((err) => err.message);
      return next( new AppError(errArr, 400) )
    }
    next();
  };
};
