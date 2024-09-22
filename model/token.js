const jwt = require("jsonwebtoken");
const secret = "advu9dvnuiwebvoadvoiewbvibewvniewnviwenvoiewnviwebivbwwh";
const conn = require("../database/bd");
const bcrypt = require("bcryptjs");

class manipulaJWT {
    verificaToken(req, res, next) {
        const verificaToken = req.cookies["jwToken"];


        if (!verificaToken) {
            res.status(500).json("err");
            return;
        }
        jwt.verify(verificaToken, secret, (err, decoded) => {
            if (err) {
                res.status(500).send({ auth: false, message: "Token inválido." });
                return;
            }

            req.userId = decoded.id;
            return;
        });
        next();
    }
    async logarUser(email, senha, res) {
        var query = "SELECT * FROM cliente WHERE email = ?;";

        conn.query(query, [email], async (err, result) => {

            let verificaSenha = bcrypt.compareSync(senha, result[0].senha);

            if (verificaSenha) {
                const token = jwt.sign({ id: result[0].idCliente }, secret);
                res.cookie("jwToken", token, { maxAge: 144440, overwrite: true });

                res.status(200).json("Login realizado com sucesso!");
                return;
            }
            res.status(401).json("Email ou senha inválidos!");
        });
    }
}

manipulaToken = new manipulaJWT;
module.exports = manipulaToken;