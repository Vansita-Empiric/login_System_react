import generateOTP from "../utils/generateOTP.js";
import { sendSMS } from "../utils/sendSMS.js";
import { UserMobile } from "../model/userMobile.model.js";
import dotenv from "dotenv";
dotenv.config();

// API endpoint to register user and send SMS
const registerUserViaMobile = async (req, res) => {
  const { mobileNumber, password, confirmPassword } = req.body;

  if (!mobileNumber || !password || !confirmPassword) {
    return res.status(400).json({ error: "Please provide all fields." });
  }

  if (password !== confirmPassword) {
    res
      .status(400)
      .json({ message: "password and confirm password are different" });
    return console.log("password and confirm password are different");
  }
  const existedUser = await UserMobile.findOne({
    mobileNumber,
  });

  if (existedUser) {
    console.log("User Already Exists.");
    res.status(409).json({ message: "Mobile number already exist" });
    return;
  }

  const from = "+1 808-470-9673";
  const otp = generateOTP();
  const otpSent = await sendSMS(mobileNumber, from, otp);
  if (!otpSent) {
    return res
      .status(500)
      .json({ message: "Failed to send otp. Please try again" });
  }

  const user = await UserMobile.create({
    mobileNumber,
    password,
    otp,
    otpExpires: Date.now() + 5 * 60 * 1000,
    isVerified: false,
  });

  const createdUser = await UserMobile.findById(user._id).select("-password");
  if (!createdUser) {
    res
      .status(500)
      .json({ message: "Something went wrong while registering user" });
    return console.log("Something went wrong while registering user");
  }

  res.status(201).json({ message: "OTP sent to ", mobileNumber });
  return console.log("OTP sent to ", mobileNumber);
};

const verifyMobileOTP = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  try {
    // Find the user by phone number
    const user = await UserMobile.findOne({ mobileNumber });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the OTP is valid and not expired
    if (user.otp === otp && Date.now() < user.otpExpires) {
      // OTP is valid, mark user as verified
      user.isVerified = true;
      user.otp = undefined; // Clear OTP
      user.otpExpires = undefined; // Clear OTP expiration
      await user.save();

      return res.status(200).json({ message: "User verified successfully!" });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while verifying OTP" });
  }
};

export { registerUserViaMobile, verifyMobileOTP };
