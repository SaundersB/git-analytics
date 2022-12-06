import * as dotenv from 'dotenv' 
dotenv.config();
import { getAzureDevOpsProvider } from './git-tool-providers/azure-dev-ops.mjs';

let orgUrl = process.env.ORG_URL;
let token = process.env.AZURE_PERSONAL_ACCESS_TOKEN;

let gitApiObject = await getAzureDevOpsProvider(orgUrl, token);

const repoId = process.env.REPO_ID
const project = process.env.PROJECT_NAME

const commits = await gitApiObject.getCommits(repoId, {}, project)
console.log(commits);        

// const pullRequests = await gitApiObject.getPullRequests(repoId, {}, project);
// console.log(pullRequests);        
