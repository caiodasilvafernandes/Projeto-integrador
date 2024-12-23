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
const mailer = require("nodemailer");
const transp = require("../model/nodemailer");

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(methodOver("method"));

router.get("/singUp", (req, res) => {
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

    let imgPerfil = req.file?.filename;

    let id = req.userId;

    let salt = bcrypt.genSaltSync(10);
    let senhaHash = bcrypt.hashSync(password, salt);

    var query = "UPDATE cliente SET login = ?, senha = ?, bio = ?, slug = ?, imgPerfil = ? WHERE idCliente = ?;";

    conn.query(query, [username, senhaHash, bio, slug(username), imgPerfil, id], (err, result) => {
        if (err) throw err;

        res.redirect("/profile");
    });
});

router.delete("/deleteCliente/:id", manipulaToken.verificaToken, (req, res) => {
    let { id } = req.params;
    var query = "DELETE FROM cliente WHERE idCliente = ?;";

    res.cookie["jwToken"] = null;

    conn.query(query, [id], (err, result) => {
        if (err) throw err;

        res.render("/");
    });
});

router.get("/profile", manipulaToken.verificaToken, async (req, res) => {
    let id = req.userId;

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

    res.render("myProfile", { cliente, pacote });
});

router.get("/profile/:slug/:id", async (req, res) => {
    let { id } = req.params;
    let render = "";
    let idUser = 0;

    if (req.cookies["jwToken"]) {
        idUser = await manipulaToken.pegarId(req, res);
        if (idUser == req.params.id) {
            render = "myProfile";
        } else {
            render = "profile";
        }
    } else {
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

router.get("/esqueceuSenha", (req, res) => {
    res.render("esqueceuSenha");
});
router.post("/codigoEmail", async (req, res) => {
    let { email } = req.body;
    let codigo = parseInt(Math.random() * 1000000);

    await transp.sendMail({
        to: email,
        from: process.env.GMAIL_MAILER,
        subject: "test",
        html: `<p> Seu código é ${codigo} </p>`
    }, (err, info) => {
        if (err) {
            console.log("erro pra enviar email", err);
            return;
        }
        res.render("codigo", { codigo, email });
    });
});

router.post("/verificaCodigo", (req, res) => {
    let { codigo, email } = req.body;

    res.render("redefinirSenha", { email });
});

router.post("/redefineSenha", async (req, res) => {
    let { senha, email } = req.body;
    let query = "UPDATE cliente SET senha = ? WHERE email = ?;";

    let salt = bcrypt.genSaltSync(10);
    let senhaHash = bcrypt.hashSync(senha, salt);

        conn.query(query, [senhaHash, email], (err, res) => {
            if (err) throw err;
        });
        
        manipulaToken.logarUser(email, senha, req, res);
});

router.get("/logOut", (req, res) => {
    res.clearCookie("jwToken");
    res.redirect("/")
});

module.exports = router;