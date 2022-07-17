const axios = require('axios')
const {Token, User} = require('../../models')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

module.exports = {
    login: async function (req, res) {
        const token = req.body.token
        if (token == undefined || token == '') {
            return res.json({message: '요청을 처리하는 중 오류가 발생하였습니다.'})
        }
        axios({
            method: 'post',
            url: "https://kauth.kakao.com/oauth/token",
            headers: {
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_KEY,
                client_secret: process.env.KAKAO_SECRET,
                code: token
            },
            responseType: 'json'
        })
            .then(async (token)=>{
                const kakao_access_token = token.data.access_token
                const kakao_refresh_token = token.data.refresh_token
                let userData = await axios({
                    method: 'get',
                    url: 'https://kapi.kakao.com/v2/user/me',
                    headers:{
                        'Authorization': `Bearer ${kakao_access_token}`
                    },
                    responseType: 'json'
                })

                // 유저 정보가 DB에 있는지 확인
                let findUserInDB = await User.findOne({
                    where: {
                        kakao_id: userData.data.id
                    }
                })
                let isNewUser = false // 기본값: false
                let user_token_data = {
                    kakao_id: userData.data.id,
                    kakao_access: kakao_access_token,
                    kakao_refresh: kakao_refresh_token,
                    user_uuid: '',
                    token_uuid: '',
                }
                if (findUserInDB == undefined) { // 유저가 없을 시 생성
                    let user_uuid = uuid.v4()
                    await User.create({
                        kakao_id: userData.data.id,
                        uuid: user_uuid,
                        name: userData.data.kakao_account.profile.nickname
                    })
                    user_token_data.user_uuid = user_uuid
                    isNewUser = true
                } else {
                    user_token_data.user_uuid = findUserInDB.uuid
                }

                // jwt 토큰 생성
                let token_uuid = uuid.v4() // refresh_token
                let access_token = jwt.sign({
                    user_uuid: user_token_data.user_uuid
                }, process.env.JWT_ACCESS_SECRET, {
                    expiresIn: '6h',
                    subject: 'access_token'
                })
                let refresh_token = jwt.sign({
                    user_uuid: user_token_data.user_uuid,
                    token_uuid: token_uuid
                }, process.env.JWT_REFRESH_SECRET, {
                    expiresIn: '336h', // 14일
                    subject: 'refresh_token'
                })
                if (isNewUser == true) {
                    user_token_data.token_uuid = token_uuid
                    await Token.create(user_token_data)
                } else {
                    await Token.update({
                        kakao_access: kakao_access_token,
                        kakao_refresh: kakao_refresh_token,
                        token_uuid: token_uuid
                    }, {
                        where: {
                            kakao_id: userData.data.id
                        }
                    })
                }

                let res_data = {
                    access_token: access_token,
                    refresh_token: refresh_token
                }
                return res.json(res_data)

            })
            .catch((error)=>{
                console.log(error)
                return res.json({message: '요청을 처리하는 중 오류가 발생하였습니다.'})
            })
    }
}