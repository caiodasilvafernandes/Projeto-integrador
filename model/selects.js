const conn = require("../database/bd");

class Select {
    async getMediaETotal(pacote) {
        let queryMedia = "SELECT (SELECT sum(avaliacao))/(SELECT count(idAvalia)) AS media FROM avaliacao WHERE idPacote = ?;";
        let queryTotalCompra = "SELECT idPacoteFav,count(idPacoteFav) AS totalCompra FROM pacotesfav_comp WHERE idFkPacote = ? AND tipo = ?;";
        
        for (let i = 0; i <= pacote.length - 1; i++) {


            var getAvalia = new Promise((resolve, reject) => {
                conn.query(queryMedia, [pacote[i].idPacote], (err, avalia) => {
                    if (err) throw reject(err);

                    resolve(avalia);
                });
            });

            var getTotal = new Promise((resolve, reject) => {
                conn.query(queryTotalCompra, [pacote[i].idPacote, "comp"], (err, comp) => {
                    if (err) throw reject(err);

                    resolve(comp)
                });
            });

            let avalia = await getAvalia;
            let comp = await getTotal;

            for (let j = 0; j <= avalia.length - 1; j++) {
                if (avalia[j].media == "NaN" || avalia[j].media == undefined) {
                    pacote[i].media = 0;
                } else {
                    pacote[i].media = parseFloat(avalia[j].media).toFixed(2);
                }
            }

            for (let j = 0; j <= avalia.length - 1; j++) {
                if (comp[j].idPacoteFav == null || comp[j].totalCompras == "NaN") {
                    pacote[i].totalCompras = 0;
                } else {
                    JSON.parse(pacote[i].totalCompras = comp[j].totalCompra);
                }
            }
        }
        return pacote;
    }
}

selects = new Select;
module.exports = selects;