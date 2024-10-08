const conn = require("../database/bd");

class Select {
    async getMediaETotal(pacote) {
        let queryMedia = "SELECT (SELECT sum(avaliacao))/(SELECT count(idAvalia)) AS media FROM avaliacao WHERE idPacote = ?;";
        let queryTotalCompra = "SELECT idPacoteFav,count(idPacoteFav) AS totalCompra FROM pacotesfav_comp WHERE idFkPacote = ? AND tipo = ?;";

        for (let i = 0; i <= pacote.length - 1; i++) {

            new Promise((resolve, reject) => {
                conn.query(queryMedia, [pacote[i].idPacote], (err, avalia) => {
                    if (err) throw reject(err);

                    for (let j = 0; j <= avalia.length - 1; j++) {
                        if (avalia[j].media == "NaN" || avalia[j].media == undefined) {
                            pacote[i].media = 0;
                        } else {
                            pacote[i].media = parseFloat(avalia[j].media).toFixed(2);
                        }
                    }
                    resolve(pacote);
                });
            });

            var getTotal = new Promise((resolve, reject) => {
                conn.query(queryTotalCompra, [pacote[i].idPacote, "comp"], (err, comp) => {
                    if (err) throw reject(err);

                    for (let j = 0; j <= comp.length - 1; j++) {
                        if (comp[j].idPacoteFav == null || comp[j].totalCompras == "NaN") {
                            pacote[i].totalCompras = 0;
                        } else {
                            pacote[i].totalCompras = comp[j].totalCompra;
                        }
                    }
                    resolve(pacote)
                });
            });
        }

        return await getTotal;
    }
}

selects = new Select;
module.exports = selects;