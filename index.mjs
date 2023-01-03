import * as dotenv from 'dotenv' 
dotenv.config();
import { getCommitersByName } from './git-tool-providers/azure-dev-ops.mjs';
import { openDb } from './db.mjs';

try {
    let commiters = await getCommitersByName()
    console.log(commiters)
} catch (error) {
    console.error(error)
}

// const pullRequests = await gitApiObject.getPullRequests(repoId, {}, project);
// console.log(pullRequests);        

