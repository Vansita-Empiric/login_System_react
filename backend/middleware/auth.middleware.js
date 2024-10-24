import { UserEmail } from "../model/userEmail.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Unauthorized request" });
      return console.log("Unauthorized request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserEmail.findById(decodeToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      res.status(401).json({ message: "Unauthorized access token" });
      return console.log("Unauthorized access token");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid access token" });
    return console.log("Invalid access token");
  }
};
