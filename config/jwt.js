import jwt from "jsonwebtoken";

export const createRefreshToken = (data) => {
    let token = jwt.sign({ data }, "KOBIMAT", {
        algorithm: "HS256",
        expiresIn: "7d",
    });
    return token;
};

export const checkRefreshToken = (token) => {
    return jwt.verify(
        token,
        "KOBIMAT",
        (error, decoded) => {
            return error;
        }
    );
};

export const createToken = (data) => {
    let token = jwt.sign({ data }, "BIMAT", {
        algorithm: "HS256",
        expiresIn: "5s",
    });
    return token;
};

export const checkToken = (token) => {
    // kiểm tra khóa bí mật có trùng hay ko
    return jwt.verify(token, "BIMAT", (error, decoded) => {
        return error;
    });
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};

export const verifyToken = (req, res, next) => {
    let { token } = req.headers;

    let checkTokenVerify = checkToken(token);
    console.log("checkTokenVerify", checkTokenVerify);
    if (checkTokenVerify == null) {
        next();
    } else {
        res.status(401).send(checkTokenVerify.name);
    }
};
