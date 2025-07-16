function getCurrentFormattedDate() {
    const now = new Date();
    now.setHours(now.getHours() + 3);
    return now.toISOString().replace('T', ' ').substring(0, 16);
}

module.exports = {
    getCurrentFormattedDate
};