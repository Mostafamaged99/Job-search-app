import bcrypt from "bcrypt";
import { User } from "../../../database/models/user.model.js";
import { messages } from "../../utilties/commons/messages.js";

//get my profile
const getMyProfile = async (req, res, next) => {
  return res.status(200).json({
    message: messages.user.getSuccess,
    user: req.authUser,
    success: true,
  });
};

//get another profile
const getProfile = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  return res
    .status(200)
    .json({ message: messages.user.getSuccess, success: true, data: user });
};

//delete profile
const deleteProfile = async (req, res, next) => {
  await User.findByIdAndDelete(req.authUser._id);
  return res
    .status(200)
    .json({ message: messages.user.deleted, success: true });
};

//update profile
const updateProfile = async (req, res, next) => {
  //get user from req
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
    req.body;
  if (email || mobileNumber) {
    const isExist = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (isExist && isExist._id.toString() !== req.authUser.id) {
      return next(new AppError("Email or mobile number already in use", 409));
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.authUser._id,
    { email, mobileNumber, recoveryEmail, DOB, lastName, firstName },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: messages.user.updated, success: true, data: updatedUser });
};

//update password
const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.authUser.id);
  const isMatch = bcrypt.compareSync(oldPassword, user.password);
  if (!isMatch) {
    return next(
      new AppError({ message: messages.user.incorrectPassword }, 401)
    );
  }
  user.password = bcrypt.hashSync(newPassword, 10);
  await user.save();
  return res.status(200).json({
    message: messages.user.updatedPassword,
    success: true,
  });
};

// accounts-by-recovery-email
const getAccountsByRecoveryEmail = async (req, res) => {
    const { recoveryEmail } = req.authUser;
    const users = await User.find({ recoveryEmail });
    return res.status(200).json({
      message: messages.user.getUsers,
      success: true,
      data: users,
    });
  };


export {
  getMyProfile,
  deleteProfile,
  updateProfile,
  getProfile,
  updatePassword,
  getAccountsByRecoveryEmail
};
