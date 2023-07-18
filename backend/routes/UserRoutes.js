const express =require("express");
const { createUser,loginUser,logoutUser,forgotPassword, resetPassword, userDetails, updatePassword, updateProfile, getAllUsers,getSingleUser, updateUserRole, deleteUser} = require("../controller/UserController");
const router=express.Router();
const {isAuthenticatedUser,authorizeRoles}= require("../middleware/auth");

router.route("/registration").post(createUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser,userDetails)
router.route("/me/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update/info").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)
router.route("/admin/users/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser).put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)



module.exports = router;