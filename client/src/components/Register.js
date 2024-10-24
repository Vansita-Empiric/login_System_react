import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../context/ProfileContext";
import { UserContext } from "../context/UserContext";

import { BiLogoSpringBoot } from "react-icons/bi";
import { SlArrowLeft } from "react-icons/sl";
import { FcGoogle } from "react-icons/fc";
import { GrGithub } from "react-icons/gr";
import { PiDog } from "react-icons/pi";

const CLIENT_ID = "Ov23liEZAZFKpV6JWY5P";

// const Register = ({ profileDetails, login, logout }) => {
const Register = () => {
  const navigate = useNavigate();

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [mobileNumber, setMobileNumer] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [otp, setOtp] = useState();
  const { setProfile } = useContext(ProfileContext);
  const { setUser } = useContext(UserContext);

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      navigate("/googleVerification");
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiAddAccount = `http://localhost:8008/users/registerUserViaMobile`;

      const response = await axios.post(
        apiAddAccount,
        {
          mobileNumber: `+91${mobileNumber}`,
          password: password,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setShowMobileModal(true);
        setPassword("");
        setConfirmPassword("");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleMobileOTPSubmit = async () => {
    try {
      const apiAddAccount = `http://localhost:8008/users/verifyMobileOTP`;

      const response = await axios.post(
        apiAddAccount,
        {
          mobileNumber: `+91${mobileNumber}`,
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setShowMobileModal(false);
      if (response.status === 200) {
        setShowMobileModal(false);
        setMobileNumer("");
        navigate("/validation");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiAddAccount = `http://localhost:8008/users/registerUserViaEmail`;

      const response = await axios.post(
        apiAddAccount,
        {
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setShowEmailModal(true);
        setPassword("");
        setConfirmPassword("");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleEmailOTPSubmit = async () => {
    try {
      const apiAddAccount = `http://localhost:8008/users/verifyMobileOTP`;

      const response = await axios.post(
        apiAddAccount,
        {
          email: email,
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setShowMobileModal(false);
      if (response.status === 200) {
        setShowMobileModal(false);
        setEmail("");
        navigate("/validation");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const loginWithGithub = () => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-center text-center bg-slate-100 min-h-screen">
          <div className="flex flex-col">
            <div className="flex gap-2 font-bold text-4xl text-blue-950 py-10 items-center">
              <BiLogoSpringBoot />
              <div>Create Account</div>
            </div>
            <div className="flex font-semibold flex-row text-lg gap-2 items-center">
              <p className="flex text-gray-800">Already have an account ?</p>
              <a className="flex text-blue-700">
                <u>Log In</u>
              </a>
            </div>
            <div className="flex py-6 flex-col gap-4 p-5">
              <form>
                <div className="flex flex-col gap-2 h-auto w-full">
                  <input
                    className="bg-gray-200 border-2 px-1 rounded-lg border-gray-300 h-10"
                    placeholder="Enter mobile no."
                    type="number"
                    required
                    onChange={(e) => setMobileNumer(e.target.value)}
                    value={mobileNumber}
                  />
                  <input
                    className="bg-gray-200 border-2 px-1 rounded-lg border-gray-300 h-10 "
                    placeholder="Enter password"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                  <input
                    className="bg-gray-200 border-2 px-1 rounded-lg border-gray-300 h-10"
                    placeholder="Enter confirm password"
                    type="password"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                  />
                  <button
                    className="bg-blue-950 text-white rounded-lg h-10"
                    onClick={handleMobileSubmit}
                  >
                    Verify Mobile no.
                  </button>
                </div>
              </form>
            </div>
            <hr />

            <div className="flex py-2 flex-col gap-4 p-5">
              <p className="text-xl text-gray-800">or</p>
            </div>
            <div className="flex py-6 flex-col gap-4 p-5">
              <form>
                <div className="flex flex-col gap-2 h-auto w-full">
                  <input
                    className="bg-gray-200 border-2 px-1 rounded-lg border-gray-300 h-10"
                    placeholder="Enter email"
                    type="text"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="bg-gray-200 border-2 px-1 rounded-lg border-gray-300 h-10 "
                    placeholder="Enter password"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    className="bg-gray-200 border-2 px-1 rounded-lg border-gray-300 h-10"
                    placeholder="Enter confirm password"
                    type="password"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    className="bg-blue-950 text-white rounded-lg h-10"
                    onClick={handleEmailSubmit}
                  >
                    Verify Email
                  </button>
                </div>
              </form>
            </div>

            <hr />

            <div className="flex py-2 flex-col gap-4 p-5">
              <p className="text-xl text-gray-800">or</p>
            </div>

            <div className="flex flex-col gap-4 py-6 p-5">
              <button
                className="flex items-center gap-2 bg-white h-10 border-2 border-gray-200 justify-center"
                onClick={googleLogin}
              >
                <FcGoogle />
                <span>Continue with Google</span>
              </button>

              <button
                className="flex items-center gap-2 bg-white h-10 border-2 border-gray-200 justify-center"
                onClick={loginWithGithub}
              >
                <GrGithub />
                <span>Continue with Github</span>
              </button>

              <button className="flex items-center gap-2 bg-white h-10 border-2 border-gray-200 justify-center"
              onClick={() => navigate("\wallet")}>
                <PiDog />
                <span>Continue with Metamask</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMobileModal ? (
        <>
          <div className="flex backdrop-blur items-center fixed inset-0 z-50 outline-slate-800 outline-2">
            <div className="relative w-auto my-6 mx-auto max-w-full sm:max-w-4xl">
              {" "}
              {/* Changed max-w-4xl to max-w-full for smaller screens */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-slate-800 outline-2 focus:outline-none">
                <div className="flex items-center justify-between p-5">
                  <SlArrowLeft
                    className="text-black h-4 w-4"
                    onClick={() => {
                      setShowMobileModal(false);
                    }}
                  />
                  <h3 className="text-xl text-black font-semibold truncate">
                    {" "}
                    {/* Added truncate for long titles */}
                    Enter OTP
                  </h3>
                  <button
                    className="bg-transparent text-3xl font-mono text-black"
                    onClick={() => {
                      setShowMobileModal(false);
                    }}
                  >
                    x
                  </button>
                </div>

                <input
                  className="border-2 text-center text-gray-800 border-gray-500 px-6 py-2 m-3 text-md flex-1"
                  type="number"
                  required
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button
                  className="bg-blue-950 text-white m-3 px-6 py-2 text-md flex-1"
                  type="button"
                  onClick={handleMobileOTPSubmit}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {showEmailModal ? (
        <>
          <div className="flex backdrop-blur items-center fixed inset-0 z-50 outline-slate-800 outline-2">
            <div className="relative w-auto my-6 mx-auto max-w-full sm:max-w-4xl">
              {" "}
              {/* Changed max-w-4xl to max-w-full for smaller screens */}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-slate-800 outline-2 focus:outline-none">
                <div className="flex items-center justify-between p-5">
                  <SlArrowLeft
                    className="text-black h-4 w-4"
                    onClick={() => {
                      setShowEmailModal(false);
                    }}
                  />
                  <h3 className="text-xl text-black font-semibold truncate">
                    {" "}
                    {/* Added truncate for long titles */}
                    Enter OTP
                  </h3>
                  <button
                    className="bg-transparent text-3xl font-mono text-black"
                    onClick={() => {
                      setShowEmailModal(false);
                    }}
                  >
                    x
                  </button>
                </div>

                <input
                  className="border-2 text-center text-gray-800 border-gray-500 px-6 py-2 m-3 text-md flex-1"
                  type="number"
                  required
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button
                  className="bg-blue-950 text-white m-3 px-6 py-2 text-md flex-1"
                  type="button"
                  onClick={handleEmailOTPSubmit}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Register;
