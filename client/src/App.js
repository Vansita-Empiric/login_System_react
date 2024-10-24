import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, lazy, useEffect, useState } from "react";
import axios from "axios";

const Register = lazy(() => import("./components/Register"));
const GithubPage = lazy(() => import("./components/GithubPage"));
const ManualValidationPage = lazy(() => import("./components/ManualValidationPage"));
const GoogleAuthenticatedPage = lazy(() => import("./components/GoogleAuthenticatedPage"));
const WalletCard = lazy(() => import("./components/WalletCard"));

const App = () => {

  

  // const logOut = () => {
  //   googleLogout();
  //   setProfile([]);
  // };

  return (
    <>
      <Router>
        <Routes>
        <Route
            path="/home"
            element={
              <Suspense
                fallback={
                  <div className="text-center">
                    Github Home is loading...
                  </div>
                }
              >
                <GithubPage />
              </Suspense>
            }
          />
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <div className="text-center">
                    Registration page is loading...
                  </div>
                }
              >
                {/* <Register profileDetails={profile} login={login} logout={logOut} /> */}
                <Register  />
              </Suspense>
            }
          />
          <Route
            path="/validation"
            element={
              <Suspense
                fallback={
                  <div className="text-center">
                    Page is loading...
                  </div>
                }
              >
                <ManualValidationPage />
              </Suspense>
            }
          />
          <Route
            path="/googleVerification"
            element={
              <Suspense
                fallback={
                  <div className="text-center">
                    google Home is loading...
                  </div>
                }
              >
                <GoogleAuthenticatedPage />
              </Suspense>
            }
          />
          <Route
            path="/wallet"
            element={
              <Suspense
                fallback={
                  <div className="text-center">
                    wallet Home is loading...
                  </div>
                }
              >
                <WalletCard />
              </Suspense>
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
