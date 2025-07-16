const path = require('path');

module.exports = {
    PORT: process.env.PORT || 3001,
    DB_PATH: path.join(__dirname, '../db.json')
};