// format data
const responseData = (res, message, data, statusCode) => {
    res.status(statusCode).json({
        message,
        content: data,
        date: new Date(),
    });
};

module.exports = responseData
