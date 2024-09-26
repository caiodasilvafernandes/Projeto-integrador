const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const slug = require("slug");
const methodOver = require("method-override");
const conn = require("../database/bd");
const manipulaToken = require("../model/token");
const GNRequest = require("../model/gerencianet");
const reqGNAlready = GNRequest;

require("dotenv").config();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(methodOver((req, res) => {
    if (req.body || "method" in req.body) {
        var method = req.body.method;
        delete req.body.method;
        return method;
    }
}));

router.get("/uploadKit", manipulaToken.verificaToken, (req, res) => {
    res.render("uploadKit");
});

router.post("/uploadKit", (req, res) => {
    let { nome, dirImg, dirPacote, dirDemo, preco } = req.body;
    let idCliente = req.userId;

    var query = "INSERT INTO pacote (nome,dirImg,dirPacote,dirDemo,idCliente,preco,slug) VALUES (?,?,?,?,?,?,?);";

    conn.query(query, [nome, dirImg, dirPacote, dirDemo, idCliente, preco, slug(nome)], (err, result) => {
        if (err) throw err;

        res.redirect;
    });

});

router.put("/updatePacote/:id", (req, res) => {
    let { nome, dirImg, dirPacote, idCliente, dirDemo, preco } = req.body;
    let { id } = req.params;

    var query = "UPDATE pacote SET nome=?,dirImg=?,dirPacote = ?, idCliente=?,dirDemo=?,preco=?,slug=? WHERE idPacote = ?;";

    conn.query(query, [nome, dirImg, dirPacote, idCliente, dirDemo, preco, slug(nome), id], (err, result) => {
        if (err) throw err;

        res.status(200).json("funfa");
    });
});

router.delete("/deletePacote/:id", (req, res) => {
    let { id } = req.params;

    var query = "DELETE FROM pacote WHERE IDPacote = ?;";

    conn.query(query, [id], (err, result) => {
        if (err) throw err;

        res.status(200).json("funfa", result);
    })
});

router.post("/favoritaProduto/:id", (req, res) => {
    let { id } = req.params;
    var query = "INSERT INTO pacotesFav_comp(idFkPacote,idFkCliente,tipo) VALUES (?,?,?);";


    conn.query(query, [2, 2, "fav"], (err, result) => {
        if (err) throw err;


        res.status(200).json("cadatro");
    });
});

router.get("/favs", manipulaToken.verificaToken, (req, res) => {
    let id = req.userId;
    let query = "SELECT * FROM pacotesfav_comp INNER JOIN pacote ON pacotesfav_comp.idFkPacote = pacote.idPacote WHERE pacotesfav_comp.tipo = 'fav' AND pacotesfav_comp.idFkCliente = ?;";

    conn.query(query, [id], (err, result) => {
        console.log(result);
        res.render("favs",{ result });
    });
});

router.get("/pagamentoPix", async (req, res) => {
    const reqGN = await reqGNAlready;
    const dataCob = {
        "calendario": {
            "expiracao": 3600
        },
        "valor": {
            "original": "2.50"
        },
        "chave": "(48)99672-9147",
        "solicitacaoPagador": "Cobrança dos serviços prestados."
    };

    const cobResponse = await reqGN.post("/v2/cob", dataCob);

    const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);
    res.send(qrcodeResponse.data)

});

router.post("/webhook(/pix)?",(req,res)=>{
    console.log(req.body);
    res.status(200);
    
})
module.exports = router