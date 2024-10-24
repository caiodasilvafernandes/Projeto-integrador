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

    //select dos pacotes populares recentes
    let select = "SELECT *,pacotesFav_Comp.dataCompra FROM pacote" ;
    let innerJoin = "INNER JOIN pacotesfav_comp ON pacote.idPacote = pacotesfav_comp.idFkPacote";
    let criterio = "WHERE dataCompra >= MONTH(dataCompra) - 1;";

    let queryPopular = `${select} ${innerJoin} ${criterio}`;

    let pacotesPopulares = await new Promise((resolve,reject)=>{
        conn.query(queryPopular,(err,pacote)=>{
            if (err) throw reject(err);

            resolve(selects.getMediaETotal(pacote));
        });
    });

    let pacoteRecente = await new Promise((resolve, reject) => {
        conn.query(query, (err, pacote) => {
            if (err) throw reject(err);

            pacote.reverse();
            resolve(selects.getMediaETotal(pacote));
        });
    });

    if (req.cookies["jwToken"] == undefined) {
        res.render("index", { pacoteRecente,pacotesPopulares });
        return;
    }
    
    res.render("indexLog", { pacoteRecente,pacotesPopulares });
});

app.use("/", controleUsuario);
app.use("/", controleCliente);
app.use("/", controlePacote);
app.use("/", controleXML);

app.listen(port);

//parte do front pacotes populares
/* <!--
          <% for(let i = 0;i <= 7; i++){ %>
            <a href="/kitPage/<%= pacotesPopulares[i].idPacote %>/<%= pacotesPopulares[i].slug %>" class="col" style="text-decoration: none;">
              <div class="card pacoteCard" style="width: 18rem;">
                <img src="/uploads/img/kitCover/<%= pacotesPopulares[i].dirImg %>" class="imgCard" alt="...">
                <div class="cardBody">
                  <h5 class="cardTitle">
                    <%= pacotesPopulares[i].nome %>
                  </h5>

                  <div class="linha"></div>

                  <img src="img/icons/star.png" class="cardStar float-start">
                  <p class="cardTxt">
                    <%= pacotesPopulares[i].media %>
                  </p>

                  <img src="img/icons/buyers.png" class="cardStar float-start">
                  <p class="cardTxt">
                    <%= pacotesPopulares[i].totalCompras %>
                  </p>
                  <br>
                </div>
              </div>
            </a>
           <% } %> -->  */