const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.loginUser);

router.get("/user", userController.getUser);
router.get("/user/:id", userController.getUserById);

router.put("/userUpdate/:id", userController.updateUser);

router.delete("/user-delete/:id", userController.deleteUser);

module.exports = router;
