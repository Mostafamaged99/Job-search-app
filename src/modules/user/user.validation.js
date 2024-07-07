import joi from "joi";
import { globalValidation } from "../../middlewares/validation.js";

export const userUpdateVal = joi
  .object({
    firstName: globalValidation.name,
    lastName: globalValidation.name,
    email: globalValidation.email,
    password: globalValidation.password,
    recoveryEmail: globalValidation.email,
    DOB: joi
      .string()
      .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Date of Birth must be in the format DD-MM-YYYY and a valid date",
      }),
    mobileNumber: globalValidation.mobile,
  })
  .required();

export const passwordUpdateVal = joi.object({
  oldPassword: globalValidation.password,
  newPassword: globalValidation.password,
}).required();
