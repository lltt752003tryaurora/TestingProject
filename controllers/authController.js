const bcrypt = require("bcrypt");
const {
    checkRefreshToken,
    checkToken,
    createRefreshToken,
    createToken,
    decodeToken,
} = require("../middlewares/jwt.js");

const model = require("../models/index");
const { responseData } = require("../config/response.js");

const controller = {
    login: async (req, res) => {
        try {
            let { username, pass_word } = req.body;
            let checkUser = await model.user.findOne({
                where: {
                    username,
                },
            });
            if (checkUser) {
                if (bcrypt.compareSync(pass_word, checkUser.pass_word)) {
                    console.log(checkUser);
                    let key = new Date().getTime();
                    let token = createToken({ id: checkUser.id, key });
                    let refToken = createRefreshToken({
                        id: checkUser.id,
                        key,
                    });

                    await model.user.update(
                        { ...checkUser.dataValues, refresh_token: refToken },
                        {
                            where: { id: checkUser.id },
                        }
                    );

                    responseData(res, "Login success", token, 200);
                } else {
                    responseData(res, "Password is not correct", "", 400);
                    return;
                }
            } else {
                responseData(res, "username is not correct", "", 400);
                return;
            }
        } catch (err) {
            console.log(err);
            responseData(res, "Internal Server Error", err.message, 500);
        }
    },
    signup: async (req, res) => {
        try {
            console.log(req.body);
            let { fullname, username, pass_word } = req.body;

            console.log(bcrypt.hashSync(pass_word, 10));

            let check_username = await model.User.findOne({
                where: {
                    username,
                },
            });

            if (check_username) {
                responseData(res, "username is exist", "", 400);
                return;
            }
            

            let newData = {
                username,
                fullname,
                hashedPassword: bcrypt.hashSync(pass_word, 10),
                // role: "user",
            };

            // Create user, thêm data của user vào bảng user
            await model.user.create(newData);

            // Đăng ký thành công
            responseData(res, "Thành công tạo tài khoản", "", 201);
        } catch (err) {
            console.log(err);
            responseData(res, "Lỗi...", err, 500);
        }
    },
    // refresh token
    tokenRefresh: async (req, res) => {
        try {
            let { token } = req.headers;

            let checkTokenVerify = checkToken(token);
            if (
                checkTokenVerify != null &&
                checkTokenVerify.name != "TokenExpiredError"
            ) {
                res.status(401).send(checkTokenVerify.name);
                return;
            }

            let accessToken = decodeToken(token);

            let getUser = await model.user.findOne({
                where: {
                    id: accessToken.data.id,
                },
            });

            let checkRef = checkRefreshToken(getUser.refresh_token);
            if (checkRef != null) {
                res.status(401).send("token refresh expried" + checkRef.name);
                return;
            }
            let refreshToken = decodeToken(getUser.refresh_token);
            if (accessToken.data.key != refreshToken.data.key) {
                res.status(401).send("token hết hạn, đừng cố cướp nữa");
                return;
            }

            // B6: tạo mới access token
            let newToken = createToken({
                id: getUser.id,
                key: refreshToken.data.key,
            });

            responseData(res, "Successfully refresh token", newToken, 200);
        } catch (err) {
            responseData(res, "Failed to refresh token", "tokenRefresh", 500);
        }
    },
    logout: async (req, res) => {
        try {
            let { token } = req.headers;

            let accessToken = decodeToken(token);

            let getUser = await model.user.findOne({
                where: {
                    id: accessToken.data.id,
                },
            });

            await model.user.update(
                { ...getUser.dataValues, refreshToken: "" },
                {
                    where: {
                        id: getUser.id,
                    },
                }
            );

            responseData(res, "Successfully logout", newToken, 200);
        } catch (err) {
            responseData(res, "Failed logout", err.message, 500);
        }
    }
}

module.exports = controller;
