const jwt = require("jsonwebtoken");
const conn = require("../database/bd");
const bcrypt = require("bcryptjs");

class manipulaJWT {
    async accessToken(id, req, res) {
        const token = await jwt.sign({ id: id }, process.env.SECRET_TOKEN);

        if (!req.cookies["jwToken"]) {
            await res.cookie("jwToken", token, { maxAge: 604800016.56, overwrite: true });
            return;
        } else {
            res.clearCookie("jwToken");
            await res.cookie("jwToken", token, { maxAge: 604800016.56, overwrite: true });
        }
        return;
    }

    async refreshToken(id, req, res) {
        const token = await jwt.sign({ id: id }, process.env.SECRET_TOKEN);

        if (!req.cookies["jwRefreshToken"]) {
            await res.cookie("jwRefreshToken", token, { maxAge: 604800016.56, overwrite: true });
            return
        } else {
            res.clearCookie("jwRefreshToken");
            await res.cookie("jwRefreshToken", token, { maxAge: 604800016.56, overwrite: true });
        };
        return;
    }

    async logarUser(login, senha, req, res) {
        var query = "SELECT * FROM cliente WHERE email = ? OR login = ?;";

        conn.query(query, [login, login], async (err, result) => {
            let verificaSenha = bcrypt.compareSync(senha, result[0].senha);

            if (verificaSenha) {
                await this.accessToken(result[0].idCliente, req, res);
                await this.refreshToken(result[0].idCliente, req, res);

                res.redirect("/");
                return;
            }
            res.redirect("/login");
        });
    }

    async verificaToken(req, res, next) {
        const verificaToken = req.cookies["jwToken"];
        const verificaRefresh = req.cookies["jwRefreshToken"];

        if (!verificaToken) {
            res.redirect("/");
            return next();
        }

        jwt.verify(verificaToken, process.env.SECRET_TOKEN, (err, decoded) => {
            if (err) {
                res.status(500).send({ auth: false, message: "Token inválido." });
                return;
            }
        });

        jwt.verify(verificaRefresh, process.env.SECRET_TOKEN, async (err, decoded) => {
            if (err) {
                res.status(500).send({ auth: false, message: "Token inválido." });
                return;
            }
            req.userId = decoded.id;
        });
        
        return next();
    }
}
manipulaToken = new manipulaJWT;
module.exports = manipulaToken;