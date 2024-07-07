import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { getApplicationsExcel } from "./yourController.js";
import { userRole } from "../../utilties/commons/enums.js";

const router = Router();

router.get("/applications-excel", auth([userRole.Company_HR]), getApplicationsExcel);

export default router;
