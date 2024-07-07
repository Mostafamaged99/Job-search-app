import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { userRole } from "../../utilties/commons/enums.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import {
  addJob,
  applyToJob,
  deleteJob,
  getAllJobs,
  getCompanyJobs,
  getFilteredJobs,
  updateJob,
} from "./job.controller.js";
import { addJobVal, updateJopVal } from "./job.validation.js";
import { validation } from "../../middlewares/validation.js";

const jobRouter = Router();

jobRouter.post(
  "/",
  auth(userRole.HR),
  validation(addJobVal),
  asyncHandler(addJob)
);
jobRouter.put("/:id", auth(userRole.HR),validation(addJobVal), asyncHandler(updateJob));
jobRouter.delete("/:id", auth(userRole.HR), asyncHandler(deleteJob));
jobRouter.get("/all-jobs", auth(userRole.HR), asyncHandler(getAllJobs));
jobRouter.get(
  "/company-jobs/:companyName",
  auth(userRole.HR),
  asyncHandler(getCompanyJobs)
);
jobRouter.get("/filter", auth(userRole.HR), getFilteredJobs);
jobRouter.post("/application", auth(userRole.user), asyncHandler(applyToJob));

export { jobRouter };
