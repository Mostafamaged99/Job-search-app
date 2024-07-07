import { model, Schema } from "mongoose";

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    numberOfEmployees: {
      type: Number,
      min: 11,
      max: 20,
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
    },
    companyHR: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { updatedAt: false },
    versionKey: false,
  }
);

export const Company = model("Company", companySchema);
