import { model, Schema } from "mongoose";
import {
  jobLocation,
  seniorityLevel,
  workingTime,
} from "../../src/utilties/commons/enums.js";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enums: Object.values(jobLocation),
      default: jobLocation.onsite,
    },
    workingTime: {
      type: String,
      enums: Object.values(workingTime),
      default: workingTime.fullTime,
    },
    seniorityLevel: {
      type: String,
      enums: Object.values(seniorityLevel),
      default: seniorityLevel.MidLevel,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    technicalSkills: {
      type: [String],
      required: true,
    },
    softSkills: {
      type: [String],
      required: true,
    },
    addedBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: { updatedAt: false },
    versionKey: false,
  }
);

export const Job = model("Job", jobSchema);
