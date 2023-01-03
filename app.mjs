import express from 'express';
import path from 'path';
import { getCommitersByName } from './git-tool-providers/azure-dev-ops.mjs';

const app = express();
const port = 3000;

app.get('/api/getCommitersByName', async (req, res) => {
    let commiters = await getCommitersByName();
    res.send(commiters);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(path.dirname('')), 'public/index.html'));
})

app.listen(port, () => {
    console.log('App running @ 3000')
})