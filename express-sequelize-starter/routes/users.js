const express = require("express");
const { check } = require("express-validator");
const { asyncHandler, handleValidationErrors } = require("../utils");

const router = express.Router();

const validateUsername =
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a username");

const validateEmailAndPassword = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
];

router.post("/", validateUsername, validateEmailAndPassword, handleValidationErrors, asyncHandler(async (req, res) => {
    console.log(req.body);
    const {username, email, password} = req.body;
}))

module.exports = router;
