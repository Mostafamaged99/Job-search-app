import joi from "joi";
import { globalValidation } from "../../middlewares/validation.js";

export const signUpVal = joi
  .object({
    firstName: globalValidation.name.required(),
    lastName: globalValidation.name.required(),
    email: globalValidation.email.required(),
    password: globalValidation.password.required(),
    recoveryEmail: globalValidation.email.required(),
    DOB: joi
      .string()
      .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Date of Birth must be in the format DD-MM-YYYY and a valid date",
      }),
    mobileNumber: globalValidation.mobile.required(),
    role: joi.string()
  })
  

export const signInVal = joi
  .object({
    email: globalValidation.email,
    password: globalValidation.password,
    mobileNumber: globalValidation.mobile,
  })
  .required();
