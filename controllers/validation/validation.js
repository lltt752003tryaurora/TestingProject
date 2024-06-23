function isValidDate(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateStr.match(regex)) {
        return false;
    }

    const date = new Date(dateStr);
    if (!date.getTime()) { // Kiểm tra ngày không hợp lệ
        return false;
    }

    return date.toISOString().substring(0, 10) === dateStr; // Đảm bảo ngày không bị biến đổi
}

module.exports = {
    isValidDate
};