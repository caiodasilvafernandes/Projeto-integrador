const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const slug = require("slug");
const methodOver = require("method-override");
const manipulaToken = require("../model/token");
const conn = require("../database/bd");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const selects = require("../model/selects");
const upload = require("../model/multer");

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(methodOver("method"));

router.get("/singUp", (req, res) => {
    let queryPais = "SELECT * FROM pais";
    let queryEstado = "SELECT * FROM estado";
    let queryCidade = "SELECT * FROM cidade";

    let pais = new Promise((resolve, reject) => {
        conn.query(queryPais, (err, pais) => {
            if (err) throw resolve(err);

            resolve(pais);
        });
    });

    let estado = new Promise((resolve, reject) => {
        conn.query(queryEstado, (err, estado) => {
            if (err) throw resolve(err);

            resolve(estado);
        });
    });

    let cidade = new Promise((resolve, reject) => {
        conn.query(queryCidade, (err, cidade) => {
            if (err) throw resolve(err);

            resolve(cidade);
        })
    })
    res.render("singUp");
});

router.post("/cadastrarCliente", async (req, res) => {
    let { name, login, email, password, dataNasc, bio, city } = req.body;

    let salt = bcrypt.genSaltSync(10);
    let senhahash = bcrypt.hashSync(password, salt);

    var query = "INSERT INTO cliente(nome,login,email,senha,dataNasc,bio,idCidade) Values (?,?,?,?,?,?,?);";

    conn.query(query, [name, login, email, senhahash, dataNasc, bio, city], (err, result) => {
        if (err) throw err;
    });
    manipulaToken.logarUser(email, password, req, res);
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    let { login, password } = req.body;

    manipulaToken.logarUser(login, password, req, res);
});

router.get("/editProfile", manipulaToken.verificaToken, (req, res) => {
    let id = req.userId

    var query = "SELECT * FROM cliente WHERE idCliente = ?;";

    conn.query(query, [id], (err, result) => {
        res.render("editProfile", { result });
    })
});

router.put("/editProfile", manipulaToken.verificaToken, upload.single("pfp"), (req, res) => {
    let { username, password, bio } = req.body;

    let imgPerfil = req.file.filename;
    let id = req.userId;

    let salt = bcrypt.genSaltSync(10);
    let senhaHash = bcrypt.hashSync(password, salt);

    var query = "UPDATE cliente SET login = ?, senha = ?, bio = ?, slug = ?, imgPerfil = ? WHERE idCliente = ?;";

    conn.query(query, [username, senhaHash, bio, slug(username), imgPerfil, id], (err, result) => {
        if (err) throw err;

        res.redirect("/profile");
    });
});

router.delete("/deleteCliente/:id", (req, res) => {
    let { id } = req.params;
    var query = "DELETE FROM cliente WHERE idCliente = ?;";

    conn.query(query, [id], (err, result) => {
        if (err) throw err;

        res.status(200).json("funfa");
    });
});

router.get("/profile",manipulaToken.verificaToken, async (req, res) => {
    let id = req.userId;

    var queryCliente = "SELECT nome,login,email,dataNasc,bio,idCidade,imgPerfil FROM cliente WHERE idCliente = ?;";
    var queryPacote = "SELECT * FROM pacote WHERE idCliente = ?;";


    var cliente = await new Promise((resolve, reject) => {
        conn.query(queryCliente, [id], (err, cliente) => {
            if (err) throw reject(err);

            console.log(cliente);

            if (cliente[0].bio == null) {
                cliente[0].bio = "Crie uma bio na edição de perfil"
            }
            resolve(cliente)
        });
    });

    var pacote = await new Promise((resolve, reject) => {
        conn.query(queryPacote, [id], (err, pack) => {
            if (err) throw reject(err);

            resolve(selects.getMediaETotal(pack));
        });
    });

    res.render("myProfile", { cliente, pacote });
});

router.get("/profile/:slug/:id", async (req, res) => {
    let { id } = req.params;
    let render = "";
    let idUser = await manipulaToken.pegarId(req,res);

    if (req.cookies["jwToken"]) {
        if (idUser == req.params.id) {
            render = "myProfile";
        }else{
            render = "profile";
        }
    }else{
        render = "profile";
    }

    var queryCliente = "SELECT nome,login,email,dataNasc,bio,idCidade,imgPerfil FROM cliente WHERE idCliente = ?;";
    var queryPacote = "SELECT * FROM pacote WHERE idCliente = ?;";


    var cliente = await new Promise((resolve, reject) => {
        conn.query(queryCliente, [id], (err, cliente) => {
            if (err) throw reject(err);

            if (cliente[0].bio == null) {
                cliente[0].bio = "Crie uma bio na edição de perfil"
            }
            resolve(cliente)
        });
    });

    var pacote = await new Promise((resolve, reject) => {
        conn.query(queryPacote, [id], (err, pack) => {
            if (err) throw reject(err);

            resolve(selects.getMediaETotal(pack));
        });
    });

    res.render(render, { cliente, pacote });
});

router.get("/logOut", (req, res) => {
    res.clearCookie("jwToken");
    res.clearCookie("jwRefreshToken")
    res.redirect("/")
});

module.exports = router;