import * as dotenv from 'dotenv' 
dotenv.config();
import { getAzureDevOpsProvider } from './git-tool-providers/azure-dev-ops.mjs';

let orgUrl = process.env.ORG_URL
let token = process.env.AZURE_PERSONAL_ACCESS_TOKEN
const repoId = process.env.REPO_ID
const project = process.env.PROJECT_NAME

let gitApiObject = await getAzureDevOpsProvider(orgUrl, token);

const commits = await gitApiObject.getCommits(repoId, {$skip: 0, $top: 15000}, project)
console.log(commits.length);        

// const pullRequests = await gitApiObject.getPullRequests(repoId, {}, project);
// console.log(pullRequests);        
