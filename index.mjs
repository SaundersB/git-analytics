import * as dotenv from 'dotenv' 
dotenv.config();
import * as azdev from "azure-devops-node-api";

// your collection url
let orgUrl = process.env.ORG_URL;
let token = process.env.AZURE_PERSONAL_ACCESS_TOKEN;

let authHandler = azdev.getPersonalAccessTokenHandler(token); 
let webApi = new azdev.WebApi(orgUrl, authHandler);  
let gitApiObject = await webApi.getGitApi();

const repoId = process.env.REPO_ID
const project = process.env.PROJECT_NAME

// const commits = gitApiObject.getCommits(repoId, {}, project)
// console.log(commits);        

const pullRequests = await gitApiObject.getPullRequests(repoId, {}, project);
console.log(pullRequests);        
