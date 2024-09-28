const conn = require("../database/bd");

class Select {
    mediaAvalia(idPacote) {
        let query = "SELECT avaliacao,count(idAvalia) AS total FROM avaliacao WHERE idPacote = ?;";
        let somaMedia = 0;
        let media = 0;

        conn.query(query, [idPacote], (err, avalia) => {
            if (err) throw err;
            
            avalia.forEach((ava) => {
                somaMedia += parseInt(ava.avaliacao);
            })

            media = somaMedia / avalia.total;

            return media;
        });
    }
    totalCompras(idPacote) {
        let query = "SELECT count(idAvalia) FROM pacotefavs_comp WHERE idFkPacote = ? AND tipo = ?;"

        conn.query(query, [idPacote, "fav"], (err, result) => {

            return result.total;
        });
    }
}

selects = new Select;
module.exports = selects;