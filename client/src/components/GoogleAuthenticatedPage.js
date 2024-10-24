import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { ProfileContext } from '../context/ProfileContext';
import { UserContext } from '../context/UserContext';
import axios from "axios";

const GoogleAuthenticatedPage = () => {

  const navigate = useNavigate();
  const { setProfile } = useContext(ProfileContext);
  const { user } = useContext(UserContext);

  const getUserInfo = async () => {
    if (user) {
        user == [] ? console.log(user) : console.log("Empty user");
        await axios
          .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: "application/json",
              },
            }
          )
          .then((res) => {
            setProfile(res.data);
            console.log("data assigned");
          })
          .catch((err) => console.log(err));
      }
  }
  
  useEffect(() => {
    getUserInfo();
  }, [user]);

  const logOut = () => {
      setProfile([]);
      navigate("/");
      googleLogout();
  };

  return (
    <div>
      <div className="flex justify-center text-center bg-slate-100 min-h-screen">
        <div className="flex flex-col gap-5 mt-20">
          <button
            className="flex items-center gap-2 bg-white h-10 border-2 border-gray-200 justify-center"
            onClick={logOut}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthenticatedPage;
