const jwt = require("jsonwebtoken");
const conn = require("../database/bd");
const bcrypt = require("bcryptjs");

class manipulaJWT {
    verificaToken(req, res, next) {
        const verificaToken = req.cookies["jwToken"];


        if (!verificaToken) {
            res.status(500).json("err");
            return;
        }
        jwt.verify(verificaToken, process.env.SECRET_TOKEN, (err, decoded) => {
            if (err) {
                res.status(500).send({ auth: false, message: "Token inválido." });
                return;
            }

            req.userId = decoded.id;
            return;
        });
        next();
    }
    async logarUser(login, senha, res) {
        var query = "SELECT * FROM cliente WHERE email = ? OR login = ?;";

        conn.query(query, [login,login], async (err, result) => {
            let verificaSenha = bcrypt.compareSync(senha, result[0].senha);

            if (verificaSenha) {
                const token = await jwt.sign({ id: result[0].idCliente }, process.env.SECRET_TOKEN);
                await res.cookie("jwToken", token, { maxAge: 3600000, overwrite: true });

                res.redirect("/");
                return;
            }
            res.redirect("login");
        });
    }
}
manipulaToken = new manipulaJWT;
module.exports = manipulaToken;