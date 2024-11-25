const axios = require("axios");
require("dotenv").config();

async function preferenceData(lista, mp) {
    let quant = parseInt(lista.length);
    lista[0].preco = parseFloat(lista[0].preco);
    
    const preferenceData = {
        items: [{
            title: "produtos",
            description: "",
            quantity: quant,
            currency_id: "BRL",
            unit_price: lista[0].preco
        }],
        payer: {
            name: lista[0].cliente,
            email: lista[0].email,
        }
    }
        const resp = await axios.post("https://api.mercadopago.com/checkout/preferences",
            preferenceData, {
            headers:{
                Authorization:`Bearer ${process.env.ACCESS_TOKEN_MP}`
            } 
        });
        
        return resp;
}

module.exports = { preferenceData };
