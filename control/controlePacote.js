const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const slug = require("slug");
const methodOver = require("method-override");
const conn = require("../database/bd");
const manipulaToken = require("../model/token");
const GNRequest = require("../model/gerencianet");
const reqGNAlready = GNRequest;
const upload = require("../model/multer");
const selects = require("../model/selects");

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

router.post("/uploadKit", upload.fields([{ name: "cover" }, { name: "pack" }, { name: "demo" }]), manipulaToken.verificaToken, (req, res) => {
    let { title, type, price } = req.body;

    let idCliente = req.userId;
    let dirImg = req.files.cover[0].filename;
    let dirPacote = req.files.pack[0].filename;
    let dirDemo = req.files.demo[0].filename;


    var queryInsert = "INSERT INTO pacote (nome,dirImg,dirPacote,dirDemo,idCliente,preco,slug,tipo) VALUES (?,?,?,?,?,?,?,?);";

    conn.query(queryInsert, [title, dirImg, dirPacote, dirDemo, idCliente, price, slug(title), type], (err, result) => {
        if (err) throw err;

        var queryVerPack = "SELECT * FROM pacote WHERE idPacote= ? AND slug = ?;";

        conn.query(queryVerPack, [result.insertId, slug(title)], (err, pacote) => {
            if (err) throw err;

            res.redirect(`/kitPage/${result.insertId}/${slug(title)}`)
        });
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

    conn.query(query, [id], (err, pacote) => {
        if (err) throw err;

        res.render("favs", { pacote });
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
    res.render("pixPayment");
    console.log(qrcodeResponse.data);
});

router.post("/webhook(/pix)?", (req, res) => {
    console.log(req.body);
    res.status(200);

});

router.get("/kitPage/:id/:slug", async (req, res) => {
    var { slug, id } = req.params;

    console.log('Rota chamada:', new Date().toISOString());

    let campos = "idPacote,preco,pacote.nome,dirImg,dirPacote,dirDemo,pacote.idCliente,pacote.slug,tipo,dataCriacao,cliente.login,cliente.slug,cliente.imgPerfil";
    let innerJoin = "INNER JOIN cliente ON pacote.idCliente = cliente.idCliente";
    let criterio = "WHERE idPacote= ? AND pacote.slug = ?;"
    let query = `SELECT ${campos} FROM pacote ${innerJoin} ${criterio}`;
    let queryPacotes = "SELECT * FROM pacote WHERE idCliente = ?";

    var pacote = await new Promise((resolve, reject) => {
        conn.query(query, [id, slug], (err, pack) => {
            if (err) throw reject(err);

            resolve(selects.getMediaETotal(pack));
        });
    });

    var pacotesUsuario = await new Promise((resolve, reject) => {
        conn.query(queryPacotes, [pacote[0].idCliente], (err, pacoteUser) => {
            if (err) throw reject(err);

            resolve(selects.getMediaETotal(pacoteUser));
        });
    });

    res.render("kitPage", { pacote, pacotesUsuario })
});

router.get("/paymentMethod", (req, res) => {
    res.render("paymentMethod");
});

router.get("/debitpayment", (req, res) => {
    res.render("debitPayment");
});

module.exports = router;