require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    environment: 'development',
    session_secret: "qwertyuiop[]1234567890-="
    // інше
};
