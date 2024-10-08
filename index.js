const express = require("express");
const app = express();
const port = 3000;
const conn = require("./database/bd");
const controleUsuario = require("./control/constroleUsuario");
const controleCliente = require("./control/controleCliente");
const controlePacote = require("./control/controlePacote")
const cookieParser = require("cookie-parser");
const selects = require("./model/selects");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", async (req, res) => {
    let query = "SELECT * FROM pacote;";
    let pacoteRecente = [];
    let pacoteR = [];
    let pacotePopular = [];
    let dataAtual = new Date()

    let packR = new Promise((resolve, reject) => {
        conn.query(query, (err, pacote) => {
            if (err) throw reject(err);

            pacote.reverse();
            resolve(selects.getMediaETotal(pacote));
        });
    });

    pacoteR = await packR;

    for(let i = 1; i <= 8;i++){
        pacoteRecente[i] = pacoteR[i];
    }

   while(pacotePopular.length <= 8){
        
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

app.listen(port);