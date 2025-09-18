const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret";

module.exports = {
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    },

    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    },

    generateToken(user) {
        return jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
    },

    verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }
}








