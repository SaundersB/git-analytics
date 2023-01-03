import express from 'express';
import { getCommitersByName } from './git-tool-providers/azure-dev-ops.mjs';

const app = express();
const port = 3000;

app.get('/api/getCommitersByName', async (req, res) => {
    let commiters = await getCommitersByName();
    res.send(commiters);
});

app.listen(port, () => {
    console.log('App running @ 3000')
})