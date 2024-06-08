import { responseData } from "../config/response.js";

import bcrypt from "bcrypt";
import {
    checkRefreshToken,
    checkToken,
    createRefreshToken,
    createToken,
    decodeToken,
} from "../config/jwt.js";

const model = require("../models/index");

export const login = async (req, res) => {
    try {
        let { username, pass_word } = req.body;
        console.log({ username, pass_word });
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
};

export const signup = async (req, res) => {
    try {
        let { fullname, username, pass_word } = req.body;

        let check_username = await model.user.findOne({
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
        responseData(res, "Lỗi...", err, 500);
    }
};

// refresh token
export const tokenRefresh = async (req, res) => {
    try {
        // cấu trúc token:  {data: {id}}
        let { token } = req.headers;

        let checkTokenVerify = checkToken(token);
        console.log("checkTokenVerify", checkTokenVerify);
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
};

export const logout = async (req, res) => {
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
};
