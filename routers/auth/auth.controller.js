const axios = require("axios");
const { Token, User } = require("../../models");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

module.exports = {
  setNewUserData: async function (req, res) {
    if (!req.isAuth) {
      // 로그인 필수
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    }

    function getAge(dateString) {
      // thanks for stackoverflow
      let today = new Date();
      let birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }

    let data = req.body;
    let name = data.name;
    let birth = data.dateOfBirth;
    let phone_number = data.phone_number;
    birth = birth.split("T")[0];
    if (
      data.agree_terms == true &&
      name.length > 1 &&
      birth.length >= 8 &&
      phone_number.length == 11 &&
      (data.type == "teenager" || data.type == "adult")
    ) {
      await User.update(
        {
          name: name,
          age: getAge(birth),
          category: data.type,
          agree_terms_of_service: data.agree_terms,
          phone_number: phone_number,
        },
        {
          where: {
            uuid: req.userUuid,
          },
        }
      );
      return res.json({
        status: "success",
        message: "요청을 정상적으로 처리하였습니다.",
        user_info: {
          name: name,
          uuid: req.userUuid,
        },
      });
    } else {
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    }
  },

  getTosCheck: async function (req, res) {
    // 사용자가 처음이용하는 사람인지 구분, 이용약관 동의, 필수정보 입력을 위함
    if (!req.isAuth) {
      // 로그인 필수
      return res.json({
        message: "요청을 처리하는 중 오류가 발생하였습니다.",
      });
    }
    let isUserAgreeTermsAndUserInfo = await User.findOne({
      where: {
        uuid: req.userUuid,
      },
      attributes: ["name", "uuid", "agree_terms_of_service"],
    });
    return res.json({
      name: isUserAgreeTermsAndUserInfo.name,
      uuid: isUserAgreeTermsAndUserInfo.uuid,
      agree_tos: isUserAgreeTermsAndUserInfo.agree_terms_of_service,
    });
  },

  login: async function (req, res) {
    console.log(req.isAuth);
    const token = req.body.token;
    if (token == undefined || token == "") {
      return res.json({ message: "요청을 처리하는 중 오류가 발생하였습니다." });
    }
    axios({
      method: "post",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      params: {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_KEY,
        client_secret: process.env.KAKAO_SECRET,
        code: token,
      },
      responseType: "json",
    })
      .then(async (token) => {
        const kakao_access_token = token.data.access_token;
        const kakao_refresh_token = token.data.refresh_token;
        let userData = await axios({
          method: "get",
          url: "https://kapi.kakao.com/v2/user/me",
          headers: {
            Authorization: `Bearer ${kakao_access_token}`,
          },
          responseType: "json",
        });

        // 유저 정보가 DB에 있는지 확인
        let findUserInDB = await User.findOne({
          where: {
            kakao_id: userData.data.id,
          },
        });
        let isNewUser = false; // 기본값: false
        let user_token_data = {
          kakao_id: userData.data.id,
          kakao_access: kakao_access_token,
          kakao_refresh: kakao_refresh_token,
          user_uuid: "",
          token_uuid: "",
          name: "",
        };
        if (findUserInDB == undefined) {
          // 유저가 없을 시 생성
          let user_uuid = uuid.v4();
          await User.create({
            kakao_id: userData.data.id,
            uuid: user_uuid,
            name: userData.data.kakao_account.profile.nickname,
          });
          user_token_data.user_uuid = user_uuid;
          user_token_data.name = userData.data.kakao_account.profile.nickname;
          isNewUser = true;
        } else {
          user_token_data.user_uuid = findUserInDB.uuid;
          user_token_data.name = findUserInDB.name;
        }

        // jwt 토큰 생성
        let token_uuid = uuid.v4(); // refresh_token
        let access_token = jwt.sign(
          {
            user_uuid: user_token_data.user_uuid,
          },
          process.env.JWT_ACCESS_SECRET,
          {
            expiresIn: "6h",
            subject: "access_token",
          }
        );
        let refresh_token = jwt.sign(
          {
            user_uuid: user_token_data.user_uuid,
            token_uuid: token_uuid,
          },
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: "336h", // 14일
            subject: "refresh_token",
          }
        );
        if (isNewUser == true) {
          user_token_data.token_uuid = token_uuid;
          await Token.create(user_token_data);
        } else {
          await Token.update(
            {
              kakao_access: kakao_access_token,
              kakao_refresh: kakao_refresh_token,
              token_uuid: token_uuid,
            },
            {
              where: {
                kakao_id: userData.data.id,
              },
            }
          );
        }

        let res_data = {
          access_token: access_token,
          refresh_token: refresh_token,
          user_info: {
            uuid: user_token_data.user_uuid,
            name: user_token_data.name,
          },
        };
        res.cookie("access_token", access_token, {
          secure: true,
          httpOnly: true,
          sameSite: "Lax",
          maxAge: 1000 * 60 * 60 * 6, // 6시간
          path: "/",
        });
        res.cookie("refresh_token", refresh_token, {
          secure: true,
          httpOnly: true,
          sameSite: "Lax",
          maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
        });
        res.json(res_data);
        res.end();
        return;
      })
      .catch((error) => {
        console.log(error);
        return res.json({
          message: "요청을 처리하는 중 오류가 발생하였습니다.",
        });
      });
  },
  logout: (req, res) => {
    console.log("로그아웃 : ", req.userUuid);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.send("로그아웃 되었습니다.");
  },

  getLoggedInUserInfo: async (req, res) => {
    if (!req.isAuth)
      return res.status(403).send({
        status: 403,
        message: "로그인 정보 오류, 다시 로그인 하세요.",
      });

    const userData = await User.findOne({
      attributes: ["category", "name", "phone_number", "age", "uuid"],
      where: { uuid: req.userUuid },
    });

    res.json(userData);
  },
};
