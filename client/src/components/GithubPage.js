import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const GithubPage = () => {

  const navigate = useNavigate();


  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});

  // Forward the user to the github login screen (we pass in the client ID)
  // User is now in the github site and logs in (github.com/login)
  // When user decides to login... they get forwarded back to localhost:3000
  // BUT localhost:3000/?code=ASDFGHJKLASDFGHJKL
  // Use the code to get the access token (code can only be used oncuechange, so we have removed </React.StrictMode> from index.js)

  useEffect(() => {
    // localhost:3000/?code=ASDFGHJKLASDFGHJKL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam);

    // local storage is nice :)
    // leave our web page for a while
    // come back and still be logged in with Github

    if (codeParam && localStorage.getItem("accessToken") === null) {
      const getAccessToken = async () => {
        await fetch(`http://localhost:8008/getAccessToken?code=${codeParam}`, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              setRerender(!rerender);
            }
          });
      };
      getAccessToken();
    }
  }, []);


  const getUserData = async () => {
    await fetch("http://localhost:8008/getUserData", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"), // Bearer ACCESSTOKEN
      },
    })
      .then((response) => {
        return response.json();
      })

      .then((data) => {
        console.log(data);
        // data = { name: "Vansita gajjar", date of birth: "some day", ... }
        setUserData(data);
      });
  };
  return (
    <div>
      <div className="flex justify-center text-center bg-slate-100 min-h-screen">
        <div className="flex flex-col gap-5 mt-20">
          {localStorage.getItem("accessToken") && (
            <>
              <h1> We have access tokens of github</h1>
              <button
                className="flex items-center gap-2 bg-white h-10 border-2 border-gray-200 justify-center"
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  setRerender(!rerender);
                  navigate("/");
                }}
              >
                Log out
              </button>
              <h3>Get user data from github API</h3>
              <button
                className="flex items-center gap-2 bg-red-300  h-10 border-2 border-gray-200 justify-center"
                onClick={getUserData}
              >
                Get user data
              </button>
              {Object.keys(userData).length !== 0 ? (
                <>
                  <h4>Hey there, {userData.login}</h4>
                  <img className="w-24 h-24" src={userData.avatar_url}></img>
                  <a href={userData.html_url} className="text-blue-600">
                    Link to Github profile
                  </a>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GithubPage;
