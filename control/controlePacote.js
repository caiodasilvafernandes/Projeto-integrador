const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const slug = require("slug");
const methodOver = require("method-override");
const conn = require("../database/bd");
const manipulaToken = require("../model/token");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(methodOver((req, res) => {
    if (req.body || "method" in req.body) {
        var method = req.body.method;
        delete req.body.method;
        return method;
    }
}));

router.get("/cadastraPacote", manipulaToken.verificaToken, (req, res) => {
    res.status(200).json("yes");
    res.end();
});

router.post("/cadastraPacote", (req, res) => {
    let { nome, dirImg, dirPacote, idCliente, dirDemo, preco } = req.body;

    var query = "INSERT INTO pacote (nome,dirImg,dirPacote,dirDemo,idCliente,preco,slug) VALUES (?,?,?,?,?,?,?);";

    conn.query(query, [nome, dirImg, dirPacote, dirDemo, idCliente, preco, slug(nome)], (err, result) => {
        if (err) throw err;

        res.status(200).json("funfa");
    });

});

router.put("/updatePacote/:id", (req, res) => {
    let { nome, dirImg, dirPacote, idCliente, dirDemo, preco } = req.body;
    let { id } = req.params;

    var query = "UPDATE pacote SET nome=?,dirImg=?,dirPacote = ?, idCliente=?,dirDemo=?,preco=?,slug=? WHERE idPacote = ?;";

    conn.query(query, [nome, dirImg, dirPacote, idCliente, dirDemo, preco, slug(nome), id], (err, result) => {
        if (err) throw err;

        res.status(200).json("funfa");
    });
});

router.delete("/deletePacote/:id", (req, res) => {
    let { id } = req.params;

    var query = "DELETE FROM pacote WHERE IDPacote = ?;";

    conn.query(query, [id], (err, result) => {
        if (err) throw err;

        res.status(200).json("funfa", result);
    })
});

router.post("/favoritaProduto/:id",(req,res)=>{
    let { id } = req.params;
    var query = "INSERT INTO pacotesFav_comp(idFkPacote,idFkCliente,tipo) VALUES (?,?,?);";


    conn.query(query,[2,2,"fav"],(err,result)=>{
        if(err) throw err;


        res.status(200).json("cadatro");
    });
});

router.get("/verFavs",manipulaToken.verificaToken,(req,res)=>{
    let id = req.userId;
    let query = "SELECT * FROM pacotesfav_comp INNER JOIN pacote ON pacotesfav_comp.idFkPacote = pacote.idPacote WHERE pacotesfav_comp.tipo = 'fav' AND pacotesfav_comp.idFkCliente = ?;";
console.log(id);

    conn.query(query,[id],(err,result)=>{
        console.log(result);
        res.status(200).json("vd s voiewnvwe"); 
    });
});

module.exports = router