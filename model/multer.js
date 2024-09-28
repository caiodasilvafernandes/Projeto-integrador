const multer = require("multer");
const date = new Date();

const dest = {
    error: null,
    destination: `./public/uploads`
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = file.originalname.split(".").pop();

        if (fileType == "png" || fileType == "jpg") {
            if (file.fieldname == "pfp") {
                cb(null,`${dest.destination}/img/pfp`);
            } else {
                cb(null,`${dest.destination}/img/kitCover`);
            }
        } else if (fileType == "zip" || fileType == "rar") {
            cb(null,`${dest.destination}/pack`);
        }
    },
    filename: function (req, file, cb) {
        cb(null, `${ date.getDate(), date.getHours(), date.getMilliseconds() + file.originalname }`);
    }
});

const upload = multer ({ storage });
module.exports = upload;