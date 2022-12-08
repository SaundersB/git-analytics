import * as dotenv from 'dotenv' 
dotenv.config();
import { getAzureDevOpsProvider } from './git-tool-providers/azure-dev-ops.mjs';
import { openDb } from './db.mjs';
import { importCommits } from './importData.mjs';

let orgUrl = process.env.ORG_URL
let token = process.env.AZURE_PERSONAL_ACCESS_TOKEN
const repoId = process.env.REPO_ID
const project = process.env.PROJECT_NAME

let gitApiObject = await getAzureDevOpsProvider(orgUrl, token);

const commits = await gitApiObject.getCommits(repoId, {$skip: 0, $top: 5}, project)
console.log(commits);        

// const pullRequests = await gitApiObject.getPullRequests(repoId, {}, project);
// console.log(pullRequests);        
const db = await openDb();
await importCommits(db, commits);
