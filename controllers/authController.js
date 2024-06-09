const bcrypt = require("bcrypt");
const {
    checkRefreshToken,
    checkToken,
    createRefreshToken,
    createAccessToken,
    decodeToken,
} = require("../utils/jwt.js");
const multer = require('multer');
const fs = require('fs');
const removeFile = require('../utils/removeFile.js');

const model = require("../models/index");
const { responseData } = require("../config/response.js");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split('.').pop();
        const filename = Date.now() + '.' + fileExtension;
        req.avatarName = filename;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const controller = {
    login: async (req, res) => {
        try {
            let { username, pass_word } = req.body;
            let checkUser = await model.User.findOne({
                where: {
                    username,
                },
            });
            if (checkUser) {
                if (bcrypt.compareSync(pass_word, checkUser.hashedPassword)) {
                    let key = new Date().getTime();
                    let accessToken = createAccessToken({
                        id: checkUser.id,
                        username: checkUser.username,
                        key
                    });
                    let refToken = createRefreshToken({
                        id: checkUser.id,
                        username: checkUser.username,
                        key,
                    });

                    await model.User.update(
                        { refreshToken: refToken },
                        { where: { id: checkUser.id } },
                    );

                    res.cookie('refreshToken', refToken, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'strict'
                    });
                    res.cookie('accessToken', accessToken, {
                        httpOnly: false,
                        secure: false,
                        sameSite: 'strict'
                    });
                    return res.send({
                        message: 'Login success.',
                    });
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
    signup: [
        upload.single('avatar'), 
        async (req, res, next) => {
            try {
                let { fullName, username, pass_word } = req.body;

                let check_username = await model.User.findOne({
                    where: {
                        username,
                    },
                });

                if (check_username) {
                    responseData(res, "username is exist", "", 400);
                    if (req.file) {
                        removeFile(`uploads/${req.avatarName}`);
                    }
                    return;
                }
                

                let newUser = {
                    username,
                    fullName,
                    hashedPassword: bcrypt.hashSync(pass_word, 10),
                    // role: "user",
                };

                // Create user, thêm data của user vào bảng user
                const user = await model.User.create(newUser);

                if (req.file) {
                    await user.update({
                        avatar: req.avatarName,
                    });
                }

                // Đăng ký thành công
                responseData(res, "Thành công tạo tài khoản", "", 201);
            } catch (err) {
                console.log(err);
                removeFile(`uploads/${req.avatarName}`);
                responseData(res, "Lỗi...", err, 500);
            }
        },
    ],
    // refresh token
    refreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            const checkTokenVerify = checkRefreshToken(refreshToken);
            if (
                checkTokenVerify != null &&
                checkTokenVerify.name != "TokenExpiredError"
            ) {
                res.status(401).send(checkTokenVerify.name);
                return;
            }

            let refreshTokenDecoded = decodeToken(refreshToken);

            let getUser = await model.User.findOne({
                where: {
                    id: refreshTokenDecoded.data.id,
                },
            });

            // let checkRef = checkRefreshToken(getUser.refreshToken);
            // if (checkRef != null) {
            //     res.status(401).send("token refresh expried" + checkRef.name);
            //     return;
            // }
            const dbRefreshTokenDecoded = decodeToken(getUser.refreshToken);
            if (refreshTokenDecoded.data.key != dbRefreshTokenDecoded.data.key) {
                res.status(401).send("Invalid refresh token");
                return;
            }

            // B6: tạo mới access token
            let newAccessToken = createAccessToken({
                id: getUser.id,
                username: getUser.username,
                key: refreshTokenDecoded.data.key,
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict'
            });
            res.cookie('accessToken', newAccessToken, {
                httpOnly: false,
                secure: false,
                sameSite: 'strict'
            });
            return res.send({
                message: 'Token refresh success.',
            });

            // responseData(res, "Successfully refresh token", newToken, 200);
        } catch (err) {
            console.log(err);
            responseData(res, "Failed to refresh token", "tokenRefresh", 500);
        }
    },
    logout: async (req, res) => {
        try {
            let { token } = req.headers;

            let accessToken = decodeToken(token);

            let getUser = await model.User.findOne({
                where: {
                    id: accessToken.data.id,
                },
            });

            await model.User.update(
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
