const express = require("express");
const router = express.Router();
const conn = require("../database/bd");
const manipulaToken = require("../model/token");

router.post("/ControleFavorita/:idPack/:fav", manipulaToken.verificaToken, (req, res) => {
    let { fav, idPack } = req.params;
    let idCliente = req.userId;
    idPack = parseInt(idPack);

    if (idCliente != null) {
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
    }
    return;
});

router.post("/ControleAvalia/:idPack/:nota", manipulaToken.verificaToken, async (req, res) => {
    let { idPack, nota } = req.params;
    let idCliente = req.userId;

    idPack = parseInt(idPack);

    if (idCliente != null) {
        let queryVerifica = "SELECT idAvalia,idCliente,idPacote FROM avaliacao WHERE  idPacote = ? AND idCliente = ?;";
        let insertAvalia = "INSERT INTO avaliacao(avaliacao,idPacote,idCliente) VALUES (?,?,?);";
        let updateAvalia = "UPDATE avaliacao SET avaliacao = ? WHERE idPacote = ? AND idCliente = ?;";

        try {
            var verificaAvalia = await new Promise((resolve, reject) => {
                conn.query(queryVerifica, [idPack, idCliente], (err, result) => {
                    if (err) throw reject(err);

                    resolve(result);
                });
            });
        } catch (err) {
            console.log(err);
        }

        if (verificaAvalia !== undefined) {
            try {
                conn.query(insertAvalia, [nota, idPack, idCliente]);
            } catch (err) {
                console.log(err);
            }
        } else {
            conn.query(updateAvalia, [nota, idPack, idCliente])
        }
    }
    return;
});

module.exports = router;