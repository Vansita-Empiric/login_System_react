import express, { response } from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import bodyParser from "body-parser";
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config({
  path: "./.env",
});
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8008, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed \n", err);
  });

app.use("/users", userRouter);

// code being passed from frontend for github
app.get("/getAccessToken", async (req, res) => {
  console.log(req.query.code);

  const params = `?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.query.code}`;
  await fetch(`https://github.com/login/oauth/access_token${params}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    });
});

// getUserData
// access token is going to be passed in as an Authorization header

app.get("/getUserData", async (req, res) => {
  req.get("Authorization"); // Bearer ACCESSTOKEN

  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"), // Bearer ACCESSTOKEN
    },
  })
    .then((response) => {
      console.log("in 1st then block", response);
      return response.json();
    })
    .then((data) => {
      console.log("in 2nd then block", data);
      res.json(data);
    });
});
