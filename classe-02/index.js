const express = require('express');
const app = express();
const axios = require('axios');
const { readFile, writeFile } = require('fs').promises;

app.use(express.json());

app.get('/enderecos/:cep', async (req, res) => {
    const cep = req.params.cep;

    async function novoCep(nomeArquivo, conteudo) {
        const data = await readFile(nomeArquivo, 'utf-8');
        const json = JSON.parse(data || '[]');

        if (!Array.isArray(json)) {
            throw new Error(`Malformed JSON. Expected array, got: ${json}.`);
        }
        json.push(conteudo);

        const jsonString = JSON.stringify(json);

        await writeFile(nomeArquivo, jsonString);
    }

    async function verificar(nomeArquivo) {
        const data = await readFile(nomeArquivo, 'utf-8');
        const json = JSON.parse(data || '[]');
        const cepFormatado = cep.substr(0, 5) + "-" + cep.substr(-3);
        let index = -1;

        for (i = 0; i < json.length; i++) {
            if (json[i].cep === cepFormatado) {
                index = i;
            }
        }

        if (index !== -1) {
            res.json(json[index]);
            return;
        } else {
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

            novoCep('enderecos.json', conteudo)
                .catch(console.error);
            res.json(conteudo);
            return;
        }
    }

    verificar('enderecos.json');
});

app.listen(8000);