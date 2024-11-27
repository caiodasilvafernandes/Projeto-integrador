const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const slug = require("slug");
const methodOver = require("method-override");
const bycript = require("bcryptjs");
const conn = require("../database/bd");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(methodOver((req, res) => {
    if (req.body || "method" in req.body) {
        var method = req.body.method;
        delete req.body.method;
        return method;
    }
}));

router.get("/about",(req,res)=>{
    res.render("about");
});

router.get("/cadastraUser", (req, res) => {
    res.status(200).json("F");
    res.end();
});

router.post("/cadastraUser", (req, res) => {
    let { nome, email, senha, tipo } = req.body;

    let salt = bycript.genSaltSync(10);
    let senhaHash = bycript.hashSync(senha, salt);
    let nomeSlug = slug(nome);

    var query = "INSERT INTO usuario(nome,senha,email,tipo,slug) VALUES (?,?,?,?,?);"
    conn.query(sql, [nome, senhaHash, email, tipo, nomeSlug], function (err, result) {
        if (err) throw err;

        res.status(200).json("funfa",result);
    });
});

router.get("/updateUser/:id", (req, res) => {
    let { id } = req.params;

    res.status(200).json(id);
    res.end();
});

router.put("/updateUser/:id", (req, res) => {
    let { nome, email, senha, tipo } = req.body;
    let { id } = req.params;

    let salt = bycript.genSaltSync(10);
    let senhaHash = bycript.hashSync(senha, salt);

    var sql = "UPDATE usuario SET nome = ?, email = ?, senha=?, tipo=?, slug=? WHERE idUser = ?;";

    conn.query(sql, [nome, email, senhaHash, tipo, slug(nome),id], (err, result) => {
        if (err) throw err;

        res.status(200).json("funfa", result);
    });
});

router.delete("/deleteUser/:id", (req, res) => {
    let { id } = req.params;

    let sql1 = "DELETE FROM pacote WHERE idCliente = ?";
    conn.query(sql1, [id], (err, result) => {
        if (err) {

            return res.status(500).json({ error: 'erro pacote', details: err.message });
        }

        let sql2 = "DELETE FROM comentario WHERE idFkCliente = ?";
        conn.query(sql2, [id], (err, result) => {
            if (err) {
               
                return res.status(500).json({ error: 'erro comentario', details: err.message });
            }

            let sql3 = "DELETE FROM cliente WHERE idCliente = ?";
            conn.query(sql3, [id], (err, result) => {
                if (err) {
               
                    return res.status(500).json({ error: 'erro cliente', details: err.message });
                }
                res.clearCookie("jwToken");
                res.clearCookie("jwRefreshToken");
                res.redirect("/");
            });
        });
    });
});


module.exports = router;