import { UserEmail } from "../model/userEmail.model.js";
import axios from "axios";
import sendOTPEmail from "../utils/sendOTPEmail.js";
import generateOTP from "../utils/generateOTP.js";

const verifyEmailWithHunter = async (email) => {
  try {
    const apiKey = process.env.HUNTER_API_KEY;
    const response = await axios.get(
      `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`
    );

    if (response.data.data.result === "deliverable") {
      console.log("Email is valid and deliverable");
      return { status: "valid", data: response.data.data };
    } else {
      console.log("Email is not deliverable");
      return { status: "invalid", data: response.data.data };
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return { status: "error", message: error.message };
  }
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while generating access and refresh token",
    });
    return console.log(
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUserViaEmail = async (req, res) => {
  const {
    email,
    password,
    confirmPassword
  } = req.body;

  const result = await verifyEmailWithHunter(email);

  if (result.status === "invalid") {
    return res.status(400).json({ message: "Invalid email address" });
  }

  if (password !== confirmPassword) {
    res
      .status(400)
      .json({ message: "password and confirm password are different" });
    return console.log("password and confirm password are different");
  }

  const existedUser = await UserEmail.findOne({
    email
  });

  if (existedUser) {
    res
      .status(400)
      .json({ message: "Email already exist" });
    return console.log("Email already exist");
  }

  // Generate OTP and send it via email
  const otp = generateOTP();
  const otpSent = await sendOTPEmail(email, otp);
  if (!otpSent) {
    return res
      .status(500)
      .json({ message: "Failed to send OTP. Please try again." });
  }

  const user = await UserEmail.create({
    email,
    password,
    otp,
    otpExpires: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
    isVerified: false,
  });

  const createdUser = await UserEmail.findById(user._id).select("-password");
  if (!createdUser) {
    res
      .status(500)
      .json({ message: "Something went wrong while registering user" });
    return console.log("Something went wrong while registering user");
  }

  res.status(201).json({ message: "Email sent to ", email });
  return console.log("Email sent to ", email);
};

// Verify OTP
const verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await UserEmail.findOne({ email });
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

const loginUser = async (req, res) => {
  // 1. req body -> data
  const { username, email, password } = req.body;

  // 2. username or email
  if (!(username || email)) {
    res.status(400).json({ message: "username or email is required" });
    return console.log("username or email is required");
  }

  // 3. find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    res.status(404).json({ message: "user does not exist" });
    return console.log("user does not exist");
  }

  // 4. password check
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    res.status(401).json({ message: "Incorrect Password" });
    return console.log("Incorrect Password");
  }

  // 5. access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  // 6. send cookies
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ message: "User logged in successfully" });
  return console.log("User logged in successfully");
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out" });
  return console.log("User logged out");
};

export { registerUserViaEmail, verifyEmailOTP, loginUser, logoutUser };
