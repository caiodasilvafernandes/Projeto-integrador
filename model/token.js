const jwt = require("jsonwebtoken");
const conn = require("../database/bd");
const bcrypt = require("bcryptjs");

class manipulaJWT {
    async logarUser(login, senha, req, res) {
        var query = "SELECT * FROM cliente WHERE email = ? OR login = ?;";
        senha = senha.toString();
        
        conn.query(query, [login, login], async (err, result) => {
            if(err) throw err;
            
            let verificaSenha = bcrypt.compareSync(senha, result[0].senha); 
            
            if (verificaSenha) {

                const token = await jwt.sign({ id: result[0].idCliente }, process.env.SECRET_TOKEN);

                await res.cookie("jwToken", token, { maxAge: 1800000, overwrite: true });

                res.redirect("/");
                return;
            }
            res.redirect("/login");
        });
    }

    async verificaToken(req, res, next) {
        const verificaToken = req.cookies["jwToken"];

        if (!verificaToken) {
            res.redirect("/");
            return next();
        }

        jwt.verify(verificaToken, process.env.SECRET_TOKEN, (err, decoded) => {
            if (err) {
                res.render("/");
            }
            
            req.userId = decoded.id;
            return;
        });

        const token = await jwt.sign({ id: req.userId }, process.env.SECRET_TOKEN);

        await res.cookie("jwToken", token, { maxAge: 1800000, overwrite: true });

        return next();
    }

    async pegarId(req,res){
        const verificaToken = req.cookies["jwToken"];

        let verifica = await new Promise((resolve,reject) =>{
            jwt.verify(verificaToken, process.env.SECRET_TOKEN, (err, decoded) => {
                if (err) {
                    reject(res.status(500).send({ auth: false, message: "Token inválido." }));
                    return;
                }
                resolve(decoded);
            });
        });
        
        return verifica.id;
    }
}
manipulaToken = new manipulaJWT;
module.exports = manipulaToken;