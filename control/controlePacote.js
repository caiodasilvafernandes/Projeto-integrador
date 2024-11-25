const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const slug = require("slug");
const methodOver = require("method-override");
const conn = require("../database/bd");
const manipulaToken = require("../model/token");
const upload = require("../model/multer");
const selects = require("../model/selects");
const { MercadoPagoConfig, Payment } = require("mercadopago");
const { preferenceData } = require("../model/mp");
const mp = ("../model/mp");

require("dotenv").config();

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN_MP,
});


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

router.get("/favs", manipulaToken.verificaToken, (req, res) => {
    let id = req.userId;
    let query = "SELECT * FROM pacotesfav_comp INNER JOIN pacote ON pacotesfav_comp.idFkPacote = pacote.idPacote WHERE pacotesfav_comp.tipo = 'fav' AND pacotesfav_comp.idFkCliente = ?;";

    conn.query(query, [id], async (err, pacote) => {
        if (err) throw err;

        pacote = await selects.getMediaETotal(pacote);

        res.render("favs", { pacote });
    });
});

router.get("/carrinho", manipulaToken.verificaToken, (req, res) => {
    let id = req.userId;

    let query = "SELECT * FROM pacotesfav_comp INNER JOIN pacote ON pacotesfav_comp.idFkPacote = pacote.idPacote WHERE pacotesfav_comp.tipo = 'car' AND pacotesfav_comp.idFkCliente = ?;";

    conn.query(query, [id], async (err, pacote) => {
        if (err) throw err;

        pacote = await selects.getMediaETotal(pacote);

        res.render("cart", { pacote });
    });
})

router.get("/kitPage/:id/:slug", async (req, res) => {
    var { slug, id } = req.params;
    var idCliente = req.userId;

    let campos = "idPacote,preco,pacote.nome,dirImg,dirPacote,dirDemo,pacote.idCliente,pacote.slug as slugPack,tipo,dataCriacao,cliente.login,cliente.slug,cliente.imgPerfil, cliente.email, cliente.nome as nomeCliente";
    let innerJoin = "INNER JOIN cliente ON pacote.idCliente = cliente.idCliente";
    let criterio = "WHERE idPacote= ? AND pacote.slug = ?;";
    let query = `SELECT ${campos} FROM pacote ${innerJoin} ${criterio}`;
    let queryPacotes = "SELECT * FROM pacote WHERE idCliente = ?";
    let queryComent = "SELECT comentario.comentario, comentario.idPacote, comentario.idFkCliente, cliente.idCliente, cliente.slug, cliente.login,cliente.imgPerfil FROM comentario  INNER JOIN cliente  ON cliente.idCliente = comentario.idFkCliente WHERE idPacote = ? ORDER BY idComentario DESC";
    let queryFav = "SELECT * FROM pacotesfav_comp WHERE idFkCliente = ? AND idFkPacote = ? AND tipo = 'fav'";
    let queryCar = "SELECT * FROM pacotesfav_comp WHERE idFkCliente = ? AND idFkPacote = ? AND tipo = 'car'";
    let queryComp = "SELECT * FROM pacotesfav_comp WHERE idFkCliente = ? AND idFkPacote = ? AND tipo = 'comp'";
    let queryAvalia = "SELECT * FROM avaliacao WHERE idCliente = ? AND idPacote = ?;";

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

    var comentario = await new Promise((resolve, reject) => {
        conn.query(queryComent, [pacote[0].idPacote], (err, coment) => {
            if (err) throw reject(err);

            resolve(coment);
        });
    });

    if (req.cookies["jwToken"] !== undefined) {
        let idUser = await manipulaToken.pegarId(req, res);

        let query = "SELECT * FROM cliente WHERE idCliente = ?;";

        let user = await new Promise((resolve, reject) => {
            conn.query(query, [idUser], (err, result) => {
                if (err) throw reject(err);

                resolve(result);
            });
        });
        
        let fav = await new Promise((resolve, reject) => {
            conn.query(queryFav, [idUser, pacote[0].idPacote], (err, result) => {
                if (err) reject(err);
                
                resolve(result)
            });
        });

        let car = await new Promise((resolve, reject) => {
            conn.query(queryCar, [idUser, pacote[0].idPacote], (err, result) => {
                if (err) reject(err);

                resolve(result)
            });
        });

        let comp = await new Promise((resolve, reject) => {
            conn.query(queryComp, [idUser, pacote[0].idPacote], (err, result) => {
                if (err) reject(err);
                
                resolve(result)
            });
        });

        let avalia = await new Promise((resolve, reject) => {
            conn.query(queryAvalia, [idUser, pacote[0].idPacote], (err, result) => {
                if (err) reject(err);

                resolve(result)
            });
        });

        res.render("kitPageLog", { pacote, pacotesUsuario, comentario, user, fav, car, comp, avalia });
        return;
    }

    res.render("kitPage", { pacote, pacotesUsuario, comentario });
});

router.post("/paymentMethod", manipulaToken.verificaToken, async (req, res) => {
    let { idPacote,cliente,email,nomeProd,preco } = req.body;
    let preference = "";

    let listaProd = [{
        idPacote:idPacote,
        cliente:cliente,
        email:email,
        nomeProd:nomeProd,
        preco:preco
    }];

    preference = await preferenceData(listaProd,MercadoPagoConfig);

    res.render("paymentMethod", { listaProd,preference });
  }
);

router.post("/process_payment", (req, res) => {
    console.log(req.body);
    
  const payment = new Payment(client);
  var idKey = Date.now().toString();

  /*const body = {
    transaction_amount: 12.34,
    payment_method_id: "pix",
    payer: {
      email: "ngmsemexe@gmail.com",
    },
  };
*/
  payment
    .create({
      body: {
        transaction_amount: 12.24,
        payment_method_id: "pix",
        payer: {
          email: "ngmsemexe@gmail.com",
        },
      },
      requestOptions: { idempotencyKey: idKey  },
    })
    .then(console.log)
    .catch(console.log);
});


router.post("/tipoPagamento/:idPacote", manipulaToken.verificaToken, (req, res) => {
    let { metodo } = req.body;
    let { idPacote } = req.params;

    if (metodo === "pix") {
        res.redirect(`/pagamentoPix/${idPacote}/${pacote.slug}`);
        return;
    }
    res.redirect(`/pagamentoCartao/${pacote.idPacote}`)
});

router.post("/pesquisa", async (req, res) => {
    let { pesquisa } = req.body;


    let campos = "idPacote,preco,pacote.nome,dirImg,dirPacote,pacote.idCliente as donoPack,cliente.idCliente,pacote.slug as slugPack,tipo,dataCriacao,cliente.login,cliente.slug,cliente.imgPerfil";
    let innerJoin = "INNER JOIN cliente ON pacote.idCliente = cliente.idCliente";
    let query = `SELECT ${campos} FROM pacote ${innerJoin} WHERE pacote.nome LIKE ?;`

    conn.query(query, [pesquisa + "%"], async (err, pacotes) => {
        if (err) throw err;

        pacotes = await selects.getMediaETotal(pacotes);

        if (req.cookies["jwToken"]) {
            res.render("searchResultsLog", { pacotes, pesquisa });
        }
        res.render("searchResults", { pacotes, pesquisa });
    });
});

router.get("/pagamentoPix/:idPacote/:packSlug", async (req, res) => {

    res.render("pixPayment");
});

router.get("/pagamentoCartao/:idPacote/:packSlug", (req, res) => {
    let { idPacote, packSlug } = req.params;
    let query = "SELECT idPacote,preco,slug FROM pacote WHERE idPacote = ? AND slug = ?;";


    res.render("debitPayment")
});

router.get("/debitpayment", (req, res) => {
    res.render("debitPayment");
});



module.exports = router;