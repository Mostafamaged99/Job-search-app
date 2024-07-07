import { Router } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { addCompany, deleteCompany, getApplicationsForJobs, getCompanyData, searchCompany } from "./company.controller.js";
import { auth } from "../../middlewares/auth.js";
import { userRole } from "../../utilties/commons/enums.js";
import { validation } from "../../middlewares/validation.js";
import { addCompanyVal } from "./company.validation.js";

const companyRouter = Router();

companyRouter.post("/",auth(userRole.HR), validation(addCompanyVal), asyncHandler(addCompany));
companyRouter.post("/",auth(userRole.HR), validation(addCompanyVal), asyncHandler(addCompany));
companyRouter.delete("/",auth(userRole.HR), asyncHandler(deleteCompany));
companyRouter.get("/:id",auth(userRole.HR), asyncHandler(getCompanyData));
companyRouter.get("/search",auth(userRole.HR), asyncHandler(searchCompany));
companyRouter.get("/job-applications", auth(userRole.HR), asyncHandler(getApplicationsForJobs));


export { companyRouter }