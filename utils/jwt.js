const jwt = require("jsonwebtoken");

module.exports = {
    createRefreshToken: (data) => {
        let token = jwt.sign({ data }, "REFRESH_TOKEN_SECRET", {
            algorithm: "HS256",
            expiresIn: "7d",
        });
        return token;
    },

    checkRefreshToken: (token) => {
        try {
            const decoded = jwt.verify(token, "REFRESH_TOKEN_SECRET");
            return null; // Không có lỗi, trả về null
        } catch (error) {
            return error; // Trả về lỗi nếu có
        }
    },

    createAccessToken: (data) => {
        let token = jwt.sign({ data }, "ACCESS_TOKEN_SECRET", {
            algorithm: "HS256",
            expiresIn: "30m",
        });
        return token;
    },

    checkAccessToken: (token) => {
        try {
            jwt.verify(token, "ACCESS_TOKEN_SECRET");
            return null; // Không có lỗi, trả về null
        } catch (error) {
            return error; // Trả về lỗi nếu có
        }
    },

    decodeToken: (token) => {
        return jwt.decode(token);
    },

    getUserFromToken: (token) => {
        try {
            const decoded = jwt.verify(token, "ACCESS_TOKEN_SECRET");
            return decoded.data;
        } catch (error) {
            return null;
        }
    },

    verifyToken: (accessToken) => {
        let checkTokenVerify = module.exports.checkAccessToken(accessToken);
        if (checkTokenVerify === null) {
            return {
                valid: true,
            };
        } else {
            return {
                valid: false,
                error: checkTokenVerify.name === "TokenExpiredError" ? "Token expired" : "Invalid token"
            };
        }
    },
};