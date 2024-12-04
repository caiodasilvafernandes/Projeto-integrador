const mailer = require("nodemailer");
require("dotenv").config();

const transp = mailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.GMAIL_MAILER,
        pass:process.env.SENHA_MAILER
    }
})
module.exports = transp;