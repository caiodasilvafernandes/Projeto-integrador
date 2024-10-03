const express = require("express");
const app = express();
const port = 3000;
const conn = require("./database/bd");
const controleUsuario = require("./control/constroleUsuario");
const controleCliente = require("./control/controleCliente");
const controlePacote = require("./control/controlePacote")
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req,res)=>{
    if(req.cookies["jwToken"] == undefined){
        res.render("index");
        return;
    }
    res.render("indexLog");
});

app.use("/", controleUsuario);
app.use("/", controleCliente);
app.use("/", controlePacote);

app.listen(port);