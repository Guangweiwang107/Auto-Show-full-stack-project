const multer = require('multer');
const path = require('path');
const sd = require('silly-datetime');
const mkdirp = require('mkdirp');
const md5 = require('md5');

let tools = {
    multer() {

        var storage = multer.diskStorage({
            destination: async (req, file, cb) => {
                let day = sd.format(new Date(), 'YYYYMMDD');

                let dir = path.join("static/upload", day)

                await mkdirp(dir);

                cb(null, dir)
            },

            filename: (req, file, cb) => {
                let extname = path.extname(file.originalname);

                cb(null, Date.now() + extname)
            }
        })

        var upload = multer({ storage: storage })

        return upload;
    },
    md5(str) {
        return md5(str);
    },
    getUnix() {
        var d = new Date();
        return d.getTime();
    },
    formatTime(unixStr) {
        let day = sd.format(unixStr, 'YYYY-MM-DD');
        return day;
    },
    unixToDay(unixStr) {
        let day = sd.format(unixStr, 'DD');
        return day
    },
    unixToYearAndMonth(unixStr) {
        let day = sd.format(unixStr, 'YYYY-MM');
        return day
    }

}
module.exports = tools;