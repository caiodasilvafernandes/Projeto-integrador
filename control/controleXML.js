const express = require("express");
const router = express.Router();
const conn = require("../database/bd");
const manipulaToken = require("../model/token");

router.post("/ControleFavorita/:idPack/:fav", manipulaToken.verificaToken, (req, res) => {
    let { fav, idPack } = req.params;
    let idCliente = req.userId;
    idPack = parseInt(idPack)
    
    
    if (fav == 1) {
        let queryFav = "INSERT INTO pacotesFav_Comp (idFKPacote,idFkCliente,tipo) VALUES (?,?,?);";

        try {
            conn.query(queryFav, [idPack, idCliente, "fav"]);
        } catch (err) {
            console.log(err);
        }
    }
    else {
        let queryDeleteFav = "DELETE FROM pacotesFav_Comp WHERE idFkPacote = ? AND idFkCliente = ? AND tipo = ?;";

        try {
            conn.query(queryDeleteFav, [idPack, idCliente, "fav"]);
        } catch (err) {
            console.log(err);
        }
    }
});

router.post("/ControleAvalia/:idPack/:nota", async (req, res) => {
    let { idPack, nota } = req.params;
    let idCliente = req.userId;
    let queryVerifica = "SELECT idPacoteFav,cliente.idCliente,idPacote INNER JOIN cliente ON cliente.idCliente = pacotesFav_Comp.idCliente FROM pacotesFav_Comp;";
    let insertAvalia = "INSERT INTO pacotesFav_Comp(avaliacao,idPacote,idCliente) VALUES (?,?,?);";
    let updateAvalia = "UPDATE avaliacao SET avaliacao = ? WHERE idPacote = ?   AND idCliente = ?;"

    try {
        var verificaAvalia = await new Promise((resolve, reject) => {
            conn.query(queryVerifica, (err, result) => {
                resolve(result);
            });
        });
    } catch (err) {
        console.log(err);
    }

    if (!verificaAvalia) {
        conn.query(insertAvalia, [nota, idPack, idCliente]);
    }else{
        conn.query(updateAvalia, [nota, idPack, idCliente])
    }
});

module.exports = router;