import joi from "joi"
import { globalValidation } from "../../middlewares/validation.js"

export const addCompanyVal = joi.object({
  companyName: globalValidation.name.required(),
  description: globalValidation.paragraph.required(),
  industry: globalValidation.paragraph.required(),
  address: globalValidation.paragraph.required(),
  numberOfEmployees: joi.number().min(11).max(20).required(),
  companyEmail: globalValidation.email.required()
})