const express = require("express");
const app = express();
const port = 3000;
const conn = require("./database/bd");
const controleUsuario = require("./control/constroleUsuario");
const controleCliente = require("./control/controleCliente");
const controlePacote = require("./control/controlePacote")
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/", (req,res)=>{
    res.status(200).json("funfa");
    res.end();
});

app.use("/", controleUsuario);
app.use("/", controleCliente);
app.use("/", controlePacote);

app.listen(port);