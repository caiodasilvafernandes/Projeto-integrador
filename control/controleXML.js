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
        return;
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

module.exports = router;