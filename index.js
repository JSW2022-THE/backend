const express = require("express");
const app = express();
const port = 2000;
const api = require("./routers");
const { swaggerUi, specs } = require("./swagger/swagger");
const db = require("./models");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { createClient } = require("redis");
const http = require("http");
const server = http.createServer(app); //socketIO 의 롱폴링을 위한 http
require("./modules/socket")(server); //socketIO Init
db.sequelize.sync(); // sequelize init

//Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let corsOptions = {
  origin: [
    "https://jsw2022.pages.dev",
    "http://localhost:3000",
    "https://jsw2022.hserver.kr",
  ], // 여기에 cors 허용할 사이트 주소 추가, 안하면 접근 불가함.
  credentials: true,
};
app.use(cors(corsOptions));
//app.use(cors({ origin: true, credentials: true })); //cors 전체 허용

const redis_client = createClient({
  url: process.env.REDIS_URL,
  user: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  database: process.env.REDIS_DATABASE,
  socket_keepalive: true,
});
redis_client.connect();

// req.isAuth 값이 true면 로그인한 상태
const isAuth = async (req, res, next) => {
  if (req.cookies.access_token) {
    // 토큰 검증
    await jwt.verify(
      req.cookies.access_token,
      process.env.JWT_ACCESS_SECRET,
      (err, tokenInfo) => {
        if (err) {
          console.log(err);
          req.isAuth = false;
        } else {
          req.userUuid = tokenInfo.user_uuid;
          req.isAuth = true;
        }
      }
    );
    req.redis_client = redis_client;
    next();
  } else {
    req.isAuth = false;
    req.redis_client = redis_client;
    next();
  }
};

app.use("/api", isAuth, api);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  res.send("What are you looking for here?");
  console.log(req.headers["x-forwarded-for"] || req.connection.remoteAddress);
});

server.listen(port, () => {
  console.log(
    "jswcup2022 backend is running on port 2000.\n127.0.0.1:2000/api-docs\nSwagger는 완전히 작성된 상태가 아닙니다.\n\n"
  );
});
