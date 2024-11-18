/*const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

require("dotenv").config();

const cert = fs.readFileSync(
    path.resolve(__dirname, `../certs/${process.env.GN_CERT}`)
);

const agent = new https.Agent({
    pfx: cert,
    passphrase: ""
});

const credentials = Buffer.from(
    `${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`
).toString("base64");

const authenticate = () => {
    return axios({
        method: "POST",
        url: `${process.env.GN_ENDPOINT}/oauth/token`,
        headers: {
            Authorization: `basic ${credentials}`,
            "Content-Type": "application/json"
        },
        httpsAgent: agent,
        data: {
            grant_type: "client_credentials"
        }
    });
};

const GNRequest = async () => {
    const authResponse = await authenticate();
    const accessToken = authResponse.data?.access_token;
    
    return axios.create({
        baseURL: process.env.GN_ENDPOINT,
        httpsAgent: agent,
        headers: {
            Authorization: `bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
};

/* router.get("/pagamentoPix", async (req, res) => {
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
}); */
//module.exports = GNRequest();