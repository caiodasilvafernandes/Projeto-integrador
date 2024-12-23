const express = require("express");
const app = express();
const port = 3000;
const conn = require("./database/bd");
const controleUsuario = require("./control/constroleUsuario");
const controleCliente = require("./control/controleCliente");
const controlePacote = require("./control/controlePacote");
const controleLocais = require("./control/controleLocais")
const cookieParser = require("cookie-parser");
const selects = require("./model/selects");
const controleXML = require("./control/controleXML");

require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", async (req, res) => {
    let query = "SELECT * FROM pacote order by idPacote desc LIMIT 8;";

    //SELECT *,pacotesfav_comp.dataCompra,pacotesfav_comp.tipo FROM pacote INNER JOIN pacotesfav_comp ON pacote.idPacote = pacotesfav_comp.idFkPacote 
    //WHERE MONTH(CURRENT_TIMESTAMP()) > MONTH(dataCompra) - 1 AND pacotesfav_comp.tipo = "comp";
    //select dos pacotes populares recentes
    let select = "SELECT *,pacotesfav_comp.dataCompra,pacotesfav_comp.tipo FROM pacote";
    let innerJoin = "INNER JOIN pacotesfav_comp ON pacote.idPacote = pacotesfav_comp.idFkPacote";
    let criterio = "WHERE pacotesfav_comp.tipo = 'comp'";

    let queryPopular = `${select} ${innerJoin} ${criterio}`;

    let pacotesPopulares = await new Promise((resolve, reject) => {
        conn.query(queryPopular, (err, pacote) => {
            if (err) throw reject(err);
            let pacoteUnico = [];

            for (let i = 0; i <= pacote.length - 1; i++) {
                let j = i + 1;

                    if (pacote[i].idFkPacote != pacote[j]?.idFkPacote) {
                        pacoteUnico[i] = pacote[i];
                }
            }

            pacoteUnico = pacoteUnico.filter((item)=> item != undefined && item != null);

            resolve(selects.getMediaETotal(pacoteUnico));
        });
    });

    pacotesPopulares.sort((a,b)=>{
        return b.totalCompras - a.totalCompras;
    });

    let pacoteRecente = await new Promise((resolve, reject) => {
        conn.query(query, (err, pacote) => {
            if (err) throw reject(err);

            resolve(selects.getMediaETotal(pacote));
        });
    });

    if (req.cookies["jwToken"] == undefined) {
        res.render("index", { pacoteRecente, pacotesPopulares });
        return;
    }
    res.render("indexLog", { pacoteRecente, pacotesPopulares });
});

app.use("/", controleUsuario);
app.use("/", controleCliente);
app.use("/", controlePacote);
app.use("/", controleXML);
app.use("/", controleLocais);

app.listen(port);