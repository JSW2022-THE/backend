const router = require("express").Router()
const user = require("./user")
const store = require("./store")
const auth = require('./auth')

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 추가 수정 삭제 조회
 */
router.use("/user", user)

/**
 * @swagger
 * tages:
 *  name: Stores
 *  description: 가게 추가 수정 삭제 조회
 */
router.use("/store", store)

/**
 * @swagger
 * tages:
 *  name: Auth
 *  description: 사용자 인증
 */
router.use("/auth", auth)


module.exports = router