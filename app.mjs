import express from 'express';
import * as dotenv from 'dotenv' 
dotenv.config();
import { getCommitersByName } from './git-tool-providers/azure-dev-ops.mjs';

const app = express();
const port = 3000;

app.get('/api/getCommitersByName', (req, res) => {
    let commiters = getCommitersByName()
    res.send(commiters);
});

app.listen(port, () => {
    console.log('App running @ 3000')
})