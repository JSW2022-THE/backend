const router = require("express").Router();
const user = require("./user");
const store = require("./store");
const auth = require("./auth");
const chat = require("./chat");
const contract = require("./contract");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 유저 추가 수정 삭제 조회
 */
router.use("/user", user);

/**
 * @swagger
 * tags:
 *  name: Store
 *  description: 가게 추가 수정 삭제 조회
 */
router.use("/store", store);

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: 사용자 인증
 */
router.use("/auth", auth);

router.use("/chat", chat);

router.use("/contract", contract);

module.exports = router;
