import { Router } from "express";
import {
  registerController,
  verifyUserController,
  loginController,
  refreshAccessTokenController,
  googleLoginController,
  getAllUsersController,
  getFriendList,
  logoutController,
  validateAccessTokenController,
  getUserDetailsById,
  getUserPostByUserId,
  updateUserData,
  changePassword,
  resetPassword,
  sendResetPasswordMail,
} from "../controllers/user-controller.js";
import { singleAvatar } from "../config/multerConfig.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/register", singleAvatar, registerController);
router.post("/verify", verifyUserController);
router.post("/login", loginController);
router.post("/login-with-google", googleLoginController);
router.post("/send-reset-password-mail", sendResetPasswordMail);
router.post("/reset-password", resetPassword);
router.use(authMiddleware);
router.get("/refresh-token", refreshAccessTokenController);
router.get("/validate-access-token", validateAccessTokenController);
router.get("/all-users", getAllUsersController);
router.get("/logout", logoutController);
router.get("/get-user-details", getUserDetailsById);
router.get("/friend-list", getFriendList);
router.get("/get-user-posts/:userId", getUserPostByUserId);
router.post("/update-user-data", singleAvatar, updateUserData);
router.post("/change-password", changePassword);


export default router;
