const express = require("express");
const app = express();
const port = 2000;
const api = require("./routers")
const { swaggerUi, specs } = require("./swagger/swagger");
const db = require("./models");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const jwt = require('jsonwebtoken')

db.sequelize.sync(); // sequelize init

//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

let whitelist = ['http://localhost:3000'] // 여기에 cors 허용할 사이트 주소 추가, 안하면 접근 불가함.
let corsOptions = {
    origin: function(origin, callback) {
        let is_whitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, is_whitelisted);
    },
    credentials: true
}
app.use(cors(corsOptions));

// req.isAuth 값이 true면 로그인한 상태
const isAuth = async (req, res, next) => {
    if (req.cookies.access_token) {
        // 토큰 검증
        await jwt.verify(req.cookies.access_token, process.env.JWT_ACCESS_SECRET, (err,tokenInfo)=> {
            if(err) {
                req.isAuth = false
            } else {
                req.isAuth = true
                req.userUuid = tokenInfo.user_uuid
            }
        })
        next()
    } else {
        req.isAuth = false
        next()
    }
}

app.use("/api", isAuth,api);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
    res.send("What are you looking for here?");
});

app.listen(port, () => {
    console.log("jswcup2022 backend is running on port 2000\n");
});