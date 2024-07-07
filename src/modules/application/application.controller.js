import { Application } from "../../../database/models/application.model.js";
import { Company } from "../../../database/models/company.model.js";
import { AppError } from "../../utilties/appError.js";
import ExcelJS from 'exceljs';

const getApplicationsExcel = async (req, res, next) => {
  try {
    const { companyId, date } = req.query;

    if (!companyId || !date) {
      return next(new AppError("Company ID and date are required", 400));
    }

    // Validate company ID
    const company = await Company.findById(companyId);
    if (!company) {
      return next(new AppError("Company not found", 404));
    }

    // Parse date
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return next(new AppError("Invalid date format", 400));
    }

    // Set date range for the target day
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Find applications for the specific company and date
    const applications = await Application.find({
      company: companyId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).populate('user').populate('job');

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Define columns
    worksheet.columns = [
      { header: 'Job Title', key: 'jobTitle', width: 30 },
      { header: 'Applicant Name', key: 'applicantName', width: 30 },
      { header: 'Applicant Email', key: 'applicantEmail', width: 30 },
      { header: 'Application Date', key: 'applicationDate', width: 20 },
    ];

    // Add rows
    applications.forEach(application => {
      worksheet.addRow({
        jobTitle: application.job.jobTitle,
        applicantName: application.user.name,
        applicantEmail: application.user.email,
        applicationDate: application.createdAt.toISOString(),
      });
    });

    // Write to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set headers and send response
    res.setHeader('Content-Disposition', 'attachment; filename="applications.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    next(new AppError("Error generating Excel sheet", 500));
  }
};

export { getApplicationsExcel };
