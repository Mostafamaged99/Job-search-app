import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { messages } from "../../utilties/commons/messages.js";
import { AppError } from "../../utilties/appError.js";
import { sendEmail } from "../../utilties/commons/emails/sendEmail.js";
import { User } from "../../../database/models/user.model.js";

const signUp = async (req, res, next) => {
  // get data from req.body
  let {
    firstName,
    lastName,
    userName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role
  } = req.body;
  // check if email exist
  const emailExist = await User.findOne({
    email,
  }); 
  if (emailExist && emailExist.comfirmedEmail === true) {
    return next(new AppError(messages.user.userAleardyExist, 409));
  }
  if (emailExist && emailExist.comfirmedEmail === false) {
    await sendEmail(email);
    return res.status(200).json({
      message: "verfify your account to register"
    })
  }
  // check if mobile exist
  const mobileExist = await User.findOne({
    mobileNumber,
  }); 
  if (mobileExist && mobileExist.comfirmedEmail === true) {
    return next(new AppError(messages.user.userAleardyExist, 409));
  }
  if (mobileExist && mobileExist.comfirmedEmail === false) {
    await sendEmail(email);
    return res.status(200).json({
      message: "verfify your account to register"
    })
  }
  // hash password
  const hashPassword = bcrypt.hashSync(password, 10);
  // prepare user
  const user = new User({
    firstName,
    lastName,
    userName: `${firstName} ${lastName}`,
    email,
    password: hashPassword,
    recoveryEmail,
    DOB,
    mobileNumber,
    role
  });
  // save user
  const createdUser = await user.save();
  // send email
  sendEmail(email);
  // send response
  createdUser.password = undefined;
  return res.status(201).json({
    message: messages.user.createdUser,
    success: true,
    data: createdUser,
  });
};

const signIn = async (req, res, next) => {
  //get data from req.body
  const { email,mobileNumber, password } = req.body;
  // check if user exist
  const user = await User.findOne({
    $or: [{ email: email }, { mobileNumber: mobileNumber }],
  });
  if (!user) {
    return next(new AppError(messages.user.userNotFound, 401));
  }
  // check if password is correct
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(new AppError(messages.user.wrongPassword, 401));
  }
  // update user status
  user.status = "online";
  await user.save();
  // create token
  const token = jwt.sign(
    { email: user.email, id: user._id, role: user.role, recoveryEmail: user.recoveryEmail },
    "thisIsMySecterKeyForAuth"
  );
  // send response
  user.password = undefined;
  return res.status(200).json({
    message: messages.user.loginedSuccessfully,
    success: true,
    token:`Bearer ${token}`,
    data: user,
  });
};

export { signUp, signIn };
