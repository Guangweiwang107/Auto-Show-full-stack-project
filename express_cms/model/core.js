const mongoose = require('mongoose');

const config = require('../config/config');

mongoose.connect(config.dbUrl, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("数据库连接成功");
});

module.exports = mongoose;