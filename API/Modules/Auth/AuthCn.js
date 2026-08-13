import { catchAsync, HandleERROR } from "vanta-api";
import User from "../User/UserMd.js";
import {
  sendAuthCode,
  verifyCode as verifySmsCode,
} from "../../Utils/SmsHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// --- Helper Function ---
const signToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

// --- 1. Initial Auth Check ---
export const auth = catchAsync(async (req, res, next) => {
  const { phoneNumber = null } = req.body;

  if (!phoneNumber) {
    return next(new HandleERROR("Please enter a valid number", 400));
  }

  const user = await User.findOne({ phoneNumber });

  // If user doesn't exist OR user has no password, send OTP
  if (!user || !user.password) {
    const resultSms = await sendAuthCode(phoneNumber);

    if (!resultSms.success) {
      return res.status(500).json({
        success: false,
        message: resultSms.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      data: {
        isNewUser: !user,
        havePassword: false,
      },
    });
  }

  // User exists and has password
  return res.status(200).json({
    success: true,
    message: "User exists, please login with password",
    data: {
      isNewUser: false,
      havePassword: true,
    },
  });
});

// --- 2. Login With Password ---
export const loginWithPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return next(new HandleERROR("Please enter phone number and password", 400));
  }

  // IMPORTANT: Explicitly select password because it's usually select:false in Schema
  const user = await User.findOne({ phoneNumber }).select("+password");

  if (!user) {
    return next(new HandleERROR("Phone number is incorrect", 401)); // 401 for Auth errors
  }

  if (!user.password) {
    return next(new HandleERROR("This account has no password set", 400));
  }

  // Use Async compare for better performance
  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    return next(new HandleERROR("Incorrect password", 401));
  }

  const token = signToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Login successfully",
    data: {
      token,
      user: {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        birthDate: user.birthDate,
      },
    },
  });
});

// --- 3. Login With OTP (FIXED) ---
export const loginWithOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber, code, password } = req.body;

  if (!phoneNumber || !code) {
    return next(new HandleERROR("Phone number and code are required", 400));
  }

  const verification = await verifySmsCode(phoneNumber, code);

  if (!verification.success) {
    return next(new HandleERROR("Code is incorrect or expired", 400));
  }

  let user = await User.findOne({ phoneNumber });

  // SCENARIO 1: New User
  if (!user) {
    let userData = { phoneNumber };
    if (password) {
      userData.password = await bcryptjs.hash(password, 12);
    }
    user = await User.create(userData);
  } 
  // SCENARIO 2: Existing User (FIXED HERE)
  else {
    // If password is provided, update it for the existing user
    if (password) {
      user.password = await bcryptjs.hash(password, 12);
      await user.save();
    }
  }

  const token = signToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Login successfully",
    data: {
      token,
      user: {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        birthDate: user.birthDate,
      },
    },
  });
});

// --- 4. Resend Code ---
export const resendCode = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new HandleERROR("Phone number is required", 400));
  }

  const resultSms = await sendAuthCode(phoneNumber);

  if (!resultSms.success) {
    return res.status(500).json({
      success: false,
      message: resultSms.message,
    });
  }

  return res.status(200).json({
    success: true,
    message: "OTP CODE SENT",
  });
});

// --- 5. Forget Password ---
export const forgetPassword = catchAsync(async (req, res, next) => {
  const { code, phoneNumber, newPassword } = req.body;

  if (!code || !phoneNumber || !newPassword) {
    return next(new HandleERROR("All fields are required", 400));
  }

  const verification = await verifySmsCode(phoneNumber, code);

  if (!verification.success) {
    return next(new HandleERROR("Code is incorrect", 400));
  }

  const user = await User.findOne({ phoneNumber });

  if (!user) return next(new HandleERROR("User not found", 404));

  // Use Async hash
  user.password = await bcryptjs.hash(newPassword, 12);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});