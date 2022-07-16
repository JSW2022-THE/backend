
const authRouter = require("express").Router()
const authController = require("./auth.controller")

// swagger 작성 예정

authRouter.post("/login", authController.login)

module.exports = authRouter