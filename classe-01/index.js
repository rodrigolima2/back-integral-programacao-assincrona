const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());

app.get('/pokemon', async (req, res) => {
    const offset = req.query.offset;
    const limit = req.query.limit;

    if (offset && limit) {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);

        res.json({ pokemons: response.data.results });
        return;
    } else {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10`);

        res.json({ pokemons: response.data.results });
        return;
    }

});
app.get('/pokemon/:idOuNome', async (req, res) => {
    const idOuNome = req.params.idOuNome;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idOuNome}/`);

    res.json({
        id: response.data.id,
        name: response.data.name,
        height: response.data.height,
        weight: response.data.weight,
        base_experience: response.data.base_experience,
        forms: response.data.forms,
        abilities: response.data.abilities,
        species: response.data.species
    });
});

app.listen(8000);