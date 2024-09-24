const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const slug = require("slug");
const methodOver = require("method-override");
const manipulaToken = require("../model/token");
const conn = require("../database/bd");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(methodOver((req, res) => {
    if (req.body || "method" in req.body) {
        var method = req.body.method;
        delete req.body.method;
        return method;
    }
}));

router.get("/singUp", (req, res) => {
    res.render("singUp");
});

router.post("/cadastrarCliente", async (req, res) => {
    let { name, login, email, password, dataNasc, bio, city } = req.body;

    let salt = bcrypt.genSaltSync(10);
    let senhahash = bcrypt.hashSync(password, salt);

    var query = "INSERT INTO cliente(nome,login, email,senha,dataNasc,bio,idCidade) Values (?,?,?,?,?,?,?);";
    
    conn.query(query, [name, login, email, senhahash, dataNasc, bio, city], (err, result) => {
        if (err) throw err;

    });
    manipulaToken.logarUser(email, password, res);
});

router.get("/updateCliente/:id", (req, res) => {

});

router.put("/updateCliente/:id", (req, res) => {
    let { nome, email, senha, dataNasc, bio, cidade } = req.body;
    let { id } = req.params;

    let salt = bcrypt.genSaltSync(10);
    let senhaHash = bcrypt.hashSync(senha, salt);

    var query = "UPDATE cliente SET nome = ?, email = ?, senha = ?, dataNasc = ?" +
        ", bio = ?,  idCidade = ?, slug = ? WHERE idCliente = ?;";

    conn.query(query, [nome, email, senhaHash, dataNasc, bio, cidade, slug(nome), id], (err, result) => {
        if (err) throw err;

        res.status(200).json("funfa");
    });
});

router.delete("/deleteCliente/:id", (req, res) => {
    let {id} = req.params;
    var query = "DELETE FROM cliente WHERE idCliente = ?;";

    conn.query(query, [id], (err, result) => {
        if (err) throw err;

        res.status(200).json("funfa");
    });
});

router.post("/loginCliente", (req, res) => {
    let {email, senha} = req.body;

    manipulaToken.logarUser(email,senha,res);
})

router.get("/perfil", manipulaToken.verificaToken, (req, res) => {
    let id = req.userId;

    var queryCliente = "SELECT nome,email,bio,dataNasc,bio,idCidade FROM cliente WHERE idCliente = ?;";
    var queryPacote = "SELECT * FROM pacote WHERE idCliente = ?;"

    conn.query(queryCliente, [id], (err, cliente) => {
        if (err) throw err;
        conn.query(queryPacote, [id], (err, pacote) => {
            if (err) throw err;
            
            console.log(cliente,pacote);
            
            res.status(200).json("funfa")
        });
    });
});

router.get("/pacotesFav", manipulaToken.verificaToken, (req, res) => {
    let id = req.userId;
    var query = "SELECT * FROM pacotesFav JOIN pacote ON pacote.idPacote = pacotesfav.idFkPacote WHERE pacotesfav_comp.tipo = 'fav' AND cliente.idCliente = ?;";
    
    conn.query(query,[id],(err,result)=>{
        if (err) throw err;

        console.log(result);
        res.status(200).json("vdunsv");
        
    })
})

module.exports = router;