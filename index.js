const express = require("express");
const app = express();
const port = 3000;
const conn = require("./database/bd");
const controleUsuario = require("./control/constroleUsuario");
const controleCliente = require("./control/controleCliente");
const controlePacote = require("./control/controlePacote")
const cookieParser = require("cookie-parser");
const selects = require("./model/selects");
const controleXML = require("./control/controleXML");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", async (req, res) => {
    let query = "SELECT * FROM pacote;";
    let pacoteRecente = [];
    let pacoteR = [];
    let pacotePopular = [];
    let dataAtual = new Date();

    let packR = new Promise((resolve, reject) => {
        conn.query(query, (err, pacote) => {
            if (err) throw reject(err);

            pacote.reverse();
            resolve(selects.getMediaETotal(pacote));
        });
    });

    packR = await packR;
    

    for(let i = 0; i <= 7;i++){
        pacoteRecente[i] = packR[i];
    }
   
    if (req.cookies["jwToken"] == undefined) {
        res.render("index", { pacoteRecente });
        return;
    }
    
    res.render("indexLog", { pacoteRecente });
});

app.use("/", controleUsuario);
app.use("/", controleCliente);
app.use("/", controlePacote);
app.use("/", controleXML);

app.listen(port);