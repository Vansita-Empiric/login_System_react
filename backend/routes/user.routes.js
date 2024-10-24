import { Router } from "express";

import { registerUserViaEmail, loginUser, logoutUser, verifyEmailOTP } from "../controller/userEmail.controller.js";
import { registerUserViaMobile, verifyMobileOTP } from "../controller/userMobile.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/registerUserViaEmail", registerUserViaEmail);
router.post('/verifyEmailOTP', verifyEmailOTP);
router.post('/registerUserViaMobile', registerUserViaMobile);
router.post('/verifyMobileOTP', verifyMobileOTP);

// router.post("/login", loginUser);
// router.post("/logout", verifyJWT, logoutUser);

export default router;
