import { Application } from "../../../database/models/application.model.js";
import { Company } from "../../../database/models/company.model.js";
import { Job } from "../../../database/models/job.model.js";
import { AppError } from "../../utilties/appError.js";
import { messages } from "../../utilties/commons/messages.js";

// add company
const addCompany = async (req, res, next) => {
  //get company from req
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR,
  } = req.body;
  //check if company exist
  const isExist = await Company.findOne({ companyName });
  if (isExist) {
    return next(new AppError({ message: messages.company.alreadyExist }, 400));
  }
  //create company
  const company = new Company({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR: req.authUser.id,
  });
  //save company
  const savedCompany = await company.save();
  //send response
  return res.status(201).json({
    message: messages.user.createdCompany,
    success: true,
    data: savedCompany,
  });
};

// Update company
const updateCompany = async (req, res, next) => {
  // Get company details from req
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;
  // Check if company exists
  const isExist = await Company.findOne({ companyName });
  if (!isExist) {
    return next(new AppError(messages.company.wrongName, 400));
  }
  // Check if current user is the owner of the company
  if (String(isExist.companyHR) !== String(req.authUser.id)) {
    return next(new AppError(messages.company.notAuthorized, 401));
  }
  // Update company
  const updatedCompany = await Company.findOneAndUpdate(
    { companyName },
    {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
    },
    { new: true } // This option ensures the updated document is returned
  );
  // Send response
  return res.status(200).json({
    message: messages.company.updatedCompany,
    success: true,
    data: updatedCompany,
  });
};

// delete company
const deleteCompany = async (req, res, next) => {
  // Check if company exists
  const isExist = await Company.findOne({ companyHR: req.authUser.id });
  if (!isExist) {
    return next(new AppError(messages.company.wrongName, 400));
  }
  // Check if current user is the owner of the company
  if (String(isExist.companyHR) !== String(req.authUser.id)) {
    return next(new AppError(messages.company.notAuthorized, 401));
  }
  // Delete company
  const deletedCompany = await Company.findOneAndDelete({
    companyHR: req.authUser.id,
  });
  // Send response
  return res.status(200).json({
    message: messages.company.deletedCompany,
    success: true,
    data: deletedCompany,
  });
};

// Get company data
const getCompanyData = async (req, res, next) => {
  const { id } = req.params;
  const company = await Company.findById(id).populate("companyHR");
  if (!company) {
    return next(new AppError({ message: "Company not found" }, 404));
  }
  return res.status(200).json({
    message: "Company fetched successfully",
    success: true,
    data: company,
  });
};

// Search for a company
const searchCompany = async (req, res, next) => {
  const { name } = req.query;
  const companies = await Company.find({
    companyName: { $regex: name, $options: "i" },
  });
  return res.status(200).json({
    message: messages.company.fetchedCompany,
    success: true,
    data: companies,
  });
};

// Get all applications for specific Jobs 
const getApplicationsForJobs = async (req, res, next) => {
  // Get the authenticated user's ID
  const { id } = req.authUser;
  // Find jobs added by this company HR
  const jobs = await Job.find({ addedBy: id }).select("_id");
  // Extract job IDs
  const jobIds = jobs.map((job) => job._id);
  // Find applications for these jobs
  const applications = await Application.find({ job: { $in: jobIds } })
    .populate("user")
    .populate("job");
  // Send response
  return res.status(200).json({
    message: "Applications fetched successfully",
    success: true,
    data: applications,
  });
};

export {
  addCompany,
  updateCompany,
  deleteCompany,
  getCompanyData,
  searchCompany,
  getApplicationsForJobs,
};
