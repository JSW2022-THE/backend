
const authRouter = require("express").Router()
const authController = require("./auth.controller")

/**
 * @swagger
 * paths:
 *  /api/auth/login:
 *      post:
 *        summary: "소셜 로그인"
 *        tags: [Auth]
 *        produces:
 *        - application/json
 *        requestBody:
 *          x-name: body
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                required:
 *                  token
 *                properties:
 *                  token:
 *                    type: string
 *        responses:
 *         200:
 *          description: access token과 refresh token 반환
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  access_token:
 *                    type: string
 *                  refresh_token:
 *                    type: string
 *         404:
 *           description: 잘못된 token
 */
authRouter.post("/login", authController.login)

module.exports = authRouter