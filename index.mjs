import * as dotenv from 'dotenv' 
dotenv.config();
import { getCommitersByName } from './git-tool-providers/azure-dev-ops.mjs';
import { openDb } from './db.mjs';

let orgUrl = process.env.ORG_URL
let token = process.env.AZURE_PERSONAL_ACCESS_TOKEN
const repoId = process.env.REPO_ID
const project = process.env.PROJECT_NAME

try {
    let commiters = getCommitersByName()
    console.log(commiters)
} catch (error) {
    console.error(error)
}

// const pullRequests = await gitApiObject.getPullRequests(repoId, {}, project);
// console.log(pullRequests);        

