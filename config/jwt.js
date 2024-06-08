const jwt = require("jsonwebtoken");


module.exports = {
    createRefreshToken: (data) => {
        let token = jwt.sign({ data }, "KOBIMAT", {
            algorithm: "HS256",
            expiresIn: "7d",
        });
        return token;
    },

    checkRefreshToken: (token) => {
        try {
            const decoded = jwt.verify(token, "KOBIMAT");
            return null; // Không có lỗi, trả về null
        } catch (error) {
            return error; // Trả về lỗi nếu có
        }
    },

    createToken: (data) => {
        let token = jwt.sign({ data }, "BIMAT", {
            algorithm: "HS256",
            expiresIn: "5s",
        });
        return token;
    },

    checkToken: (token) => {
        try {
            jwt.verify(token, "BIMAT");
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
            const decoded = jwt.verify(token, "BIMAT");
            return decoded.data;
        } catch (error) {
            return null;
        }
    },

    verifyToken: (req, res, next) => {
        let { token } = req.headers;

        let checkTokenVerify = checkToken(token);
        if (checkTokenVerify === null) {
            req.user = getUserFromToken(token);
            next();
        } else {
            if (checkTokenVerify.name === "TokenExpiredError") {
                res.status(401).send("Token expired");
            } else {
                res.status(401).send("Invalid token");
            }
        }
    }
};