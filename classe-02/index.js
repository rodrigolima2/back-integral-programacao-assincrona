const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs');

app.use(express.json());

app.get('/enderecos/:cep', async (req, res) => {
    const cep = req.params.cep;

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const conteudo = {
        "cep": response.data.cep,
        "logradouro": response.data.logradouro,
        "complemento": response.data.complemento,
        "bairro": response.data.bairro,
        "localidade": response.data.localidade,
        "uf": response.data.uf,
        "ibge": response.data.ibge,
        "gia": response.data.gia,
        "ddd": response.data.ddd,
        "siafi": response.data.siafi
    };

    res.json(conteudo);
});

app.listen(8000);