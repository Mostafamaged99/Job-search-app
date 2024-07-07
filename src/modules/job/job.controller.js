import { Application } from "../../../database/models/application.model.js";
import { Company } from "../../../database/models/company.model.js";
import { Job } from "../../../database/models/job.model.js";
import { AppError } from "../../utilties/appError.js";

const addJob = async (req, res, next) => {
  // get job details
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    companyId,
  } = req.body;
  // check if company exists
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new AppError("Company not found", 400));
  }
  // create job
  const job = new Job({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: req.authUser.id,
    company: companyId,
  });
  // save job
  const savedJob = await job.save();
  // send response
  return res.status(201).json({
    message: "Job created successfully",
    success: true,
    data: savedJob,
  });
};

// update job
const updateJob = async (req, res, next) => {
  // get job details
  const { ...updateData } = req.body;
  const { id } = req.params;
  // check if job exists
  const job = await Job.findById(id);
  if (!job) {
    return next(new AppError({ message: "Job not found" }, 404));
  }
  // check if current user is the owner of the job
  if (String(job.addedBy) !== String(req.authUser.id)) {
    return next(new AppError(messages.job.notAuthorized, 401));
  }
  // update job
  const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true });
  return res.status(200).json({
    message: "Job updated successfully",
    success: true,
    data: updatedJob,
  });
};

// delete job
const deleteJob = async (req, res, next) => {
  const { id } = req.params;
  // check if job exists
  const job = await Job.findById(id);
  if (!job) {
    return next(new AppError({ message: "Job not found" }, 404));
  }
  // check if current user is the owner of the job
  if (String(job.addedBy) !== String(req.authUser.id)) {
    return next(new AppError({ message: "Job not authorized" }, 401));
  }
  // delete job
  await Job.findByIdAndDelete(id);
  return res.status(200).json({
    message: { message: "Job deleted successfully" },
    success: true,
  });
};

// get all jobs
const getAllJobs = async (req, res, next) => {
  const jobs = await Job.find().populate("company").populate("addedBy");
  return res.status(200).json({
    message: "Jobs fetched successfully",
    success: true,
    data: jobs,
  });
};

// Get all Jobs for a specific company
const getCompanyJobs = async (req, res, next) => {
  const { companyName } = req.params;
  // check if company exists
  const company = await Company.findOne({ companyName });
  if (!company) {
    return next(new AppError({ message: "Company not found" }, 404));
  }
  // get jobs
  const jobs = await Job.find({ company: company._id })
    .populate("company")
    .populate("addedBy");
  return res.status(200).json({
    message: "Jobs fetched successfully",
    success: true,
    data: jobs,
  });
};

// Get all Jobs that match filters
const getFilteredJobs = async (req, res, next) => {
  //  get filters
  const filters = req.query;
  // get jobs
  const jobs = await Job.find(filters).populate("company").populate("addedBy");
  // send response
  return res.status(200).json({
    message: "Jobs fetched successfully",
    success: true,
    data: jobs,
  });
};

// Apply to Job
const applyToJob = async (req, res, next) => {
  // get job details
  const { jobId, userId } = req.body;
  // check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    return next(new AppError({ message: "Job not found" }, 404));
  }
  // prepare application  
  const application = new Application({
    jobId,
    userId,
    appliedAt: new Date(),
  });
  // save application
  const savedApplication = await application.save();
  // send response
  return res.status(201).json({
    message: { message: "Application created successfully" },
    success: true,
    data: savedApplication,
  });
};

export {
  addJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getCompanyJobs,
  getFilteredJobs,
  applyToJob,
};
