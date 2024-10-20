const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const slug = require("slug");
const conn = require("../database/bd");
const manipulaToken = require("../model/token");

router.post("/ControleFavorita/:idPack/:fav", manipulaToken.verificaToken, (req, res) => {
    let { fav, idPack } = req.params;

    if (fav === "1") {
        res.redirect(`/favoritaPack/${idPack}`);
    }
    res.redirect(`/desfavoritaPack/${idCliente}`);
});

router.post("/favoritaPack/:idPack", (req, res) => {
    let { idPack } = req.params;
    let idCliente = req.userId;
    let queryFav = "INSERT INTO pacotesFav_Comp (idFKPacote,idFkCliente,tipo) VALUES ?,?,?;";

    try{
        conn.query(queryFav, [idPack, idCliente,"fav"]);
    }catch(err){
        console.log(err);
    }
});

router.post("/desfavoritaPack/:idPack", (req, res) => {
    let { idPack } = req.params;
    let idCliente = req.userId;
    let queryDeleteFav = "DELETE pacotesFav_Comp WHERE idFkPacote = ?, idFkCliente = ?;";

    try{
        conn.query(queryDeleteFav, [idPack, idCliente]);
    }catch(err){
        console.log(err);
    }
});

module.exports = router;