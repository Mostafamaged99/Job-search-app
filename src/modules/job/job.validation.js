import joi from "joi";
import { globalValidation } from "../../middlewares/validation.js";

export const addJobVal = joi
  .object({
    jobTitle: globalValidation.paragraph,
    jobLocation: globalValidation.paragraph,
    workingTime: globalValidation.paragraph,
    seniorityLevel: globalValidation.paragraph,
    jobDescription: globalValidation.paragraph,
    technicalSkills:joi.array().items(joi.string()),
    softSkills:joi.array().items(joi.string()),
    addedBy: joi.string().hex().length(24).required(),
    companyId:joi.string().hex().length(24).required(),
  })
  .required();

export const updateJopVal = joi.object({
    jobTitle: globalValidation.name,
    jobDescription:globalValidation.name,
    technicalSkills:joi.array().items(joi.string()),
    softSkills:joi.array().items(joi.string()),
})